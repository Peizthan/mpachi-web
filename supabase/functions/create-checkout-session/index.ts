import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'npm:stripe@16.5.0';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const siteUrl = Deno.env.get('SITE_URL');

    if (!supabaseUrl || !supabaseAnonKey || !stripeSecretKey || !siteUrl) {
      throw new Error('Missing required environment variables');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const guideId = body?.guideId as string | undefined;
    const rawCouponCode = body?.couponCode as string | undefined;
    const couponCode = rawCouponCode ? rawCouponCode.trim().toUpperCase() : undefined;

    if (!guideId) {
      return new Response(JSON.stringify({ error: 'guideId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: guide, error: guideError } = await userClient
      .from('guides')
      .select('id,title,description,slug,price_cents,currency,is_published,is_active')
      .eq('id', guideId)
      .single();

    if (guideError || !guide || !guide.is_published || !guide.is_active) {
      return new Response(JSON.stringify({ error: 'Guide not available for sale' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

    // Validate and apply coupon if provided
    const serviceClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? supabaseAnonKey);
    let stripeDiscounts: { coupon: string }[] = [];

    if (couponCode) {
      const now = new Date().toISOString();
      const { data: discountRow, error: discountError } = await serviceClient
        .from('discount_codes')
        .select('id,code,discount_type,discount_value,currency,max_uses,current_uses,valid_until,is_active')
        .eq('code', couponCode)
        .eq('is_active', true)
        .single();

      const isValid =
        !discountError &&
        discountRow &&
        (discountRow.valid_until == null || discountRow.valid_until > now) &&
        (discountRow.max_uses == null || discountRow.current_uses < discountRow.max_uses);

      if (isValid) {
        // Create (or retrieve) a Stripe coupon for this discount
        const couponParams =
          discountRow.discount_type === 'percentage'
            ? { percent_off: discountRow.discount_value, duration: 'once' as const }
            : { amount_off: discountRow.discount_value, currency: discountRow.currency, duration: 'once' as const };

        const stripeCoupon = await stripe.coupons.create({
          ...couponParams,
          metadata: { discount_code_id: discountRow.id, code: couponCode },
        });

        stripeDiscounts = [{ coupon: stripeCoupon.id }];

        // Increment current_uses atomically
        await serviceClient
          .from('discount_codes')
          .update({ current_uses: discountRow.current_uses + 1 })
          .eq('id', discountRow.id);

        // Log the discount usage
        await serviceClient.from('access_logs').insert({
          user_id: user.id,
          action: 'discount_code_applied',
          resource_type: 'discount_code',
          status_code: 200,
          error_message: couponCode,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${siteUrl}/dashboard?checkout=success`,
      cancel_url: `${siteUrl}/store?checkout=cancelled`,
      ...(stripeDiscounts.length > 0 && { discounts: stripeDiscounts }),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: guide.currency,
            unit_amount: guide.price_cents,
            product_data: {
              name: guide.title,
              description: guide.description ?? undefined,
              metadata: {
                guide_id: guide.id,
                guide_slug: guide.slug ?? '',
              },
            },
          },
        },
      ],
      metadata: {
        guide_id: guide.id,
        user_id: user.id,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
