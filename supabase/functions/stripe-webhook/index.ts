import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'npm:stripe@16.5.0';
import { corsHeaders } from '../_shared/cors.ts';

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey || !stripeWebhookSecret) {
      throw new Error('Missing required environment variables');
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return json({ error: 'Missing stripe-signature header' }, 400);
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });
    const payload = await req.text();

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(payload, signature, stripeWebhookSecret);
    } catch {
      return json({ error: 'Invalid webhook signature' }, 400);
    }

    const service = createClient(supabaseUrl, supabaseServiceKey);

    // ---------------------------------------------------------------
    // checkout.session.completed → create order + order_items
    // ---------------------------------------------------------------
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== 'paid') {
        return json({ received: true, skipped: 'payment_status_not_paid' });
      }

      const sessionId = session.id;
      const userId = session.metadata?.user_id;
      const guideId = session.metadata?.guide_id;

      if (!sessionId || !userId || !guideId) {
        return json({ error: 'Missing required metadata in session' }, 400);
      }

      const { data: existingOrder, error: existingError } = await service
        .from('orders')
        .select('id')
        .eq('payment_provider_session_id', sessionId)
        .maybeSingle();

      if (existingError) {
        return json({ error: existingError.message }, 500);
      }

      if (existingOrder) {
        return json({ received: true, idempotent: true });
      }

      const { data: guide, error: guideError } = await service
        .from('guides')
        .select('id,title,price_cents,currency,is_active')
        .eq('id', guideId)
        .single();

      if (guideError || !guide || !guide.is_active) {
        return json({ error: 'Guide not found or inactive' }, 400);
      }

      const orderNumber = `MPA-${Date.now()}-${sessionId.slice(-6).toUpperCase()}`;

      const { data: order, error: orderError } = await service
        .from('orders')
        .insert({
          user_id: userId,
          order_number: orderNumber,
          status: 'confirmed',
          total_amount: (guide.price_cents / 100).toFixed(2),
          payment_method: 'stripe_checkout',
          payment_provider: 'stripe',
          payment_status: 'paid',
          payment_provider_session_id: sessionId,
          payment_provider_payment_intent:
            typeof session.payment_intent === 'string' ? session.payment_intent : null,
          notes: 'Auto-created from verified Stripe webhook',
        })
        .select('id')
        .single();

      if (orderError || !order) {
        return json({ error: orderError?.message ?? 'Order creation failed' }, 500);
      }

      const unitPrice = (guide.price_cents / 100).toFixed(2);
      const { error: itemError } = await service.from('order_items').insert({
        order_id: order.id,
        guide_id: guide.id,
        quantity: 1,
        unit_price: unitPrice,
        subtotal: unitPrice,
      });

      if (itemError) {
        return json({ error: itemError.message }, 500);
      }

      await service.from('access_logs').insert({
        user_id: userId,
        action: 'stripe_checkout_completed',
        resource_type: 'order',
        resource_id: order.id,
        status_code: 200,
        error_message: null,
      });
    }

    // ---------------------------------------------------------------
    // checkout.session.expired → mark pending orders as cancelled
    // ---------------------------------------------------------------
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = session.id;

      const { data: order } = await service
        .from('orders')
        .select('id,user_id')
        .eq('payment_provider_session_id', sessionId)
        .maybeSingle();

      if (order) {
        await service
          .from('orders')
          .update({ payment_status: 'failed', status: 'cancelled' })
          .eq('id', order.id);

        await service.from('access_logs').insert({
          user_id: order.user_id,
          action: 'stripe_checkout_expired',
          resource_type: 'order',
          resource_id: order.id,
          status_code: 200,
          error_message: null,
        });
      }
    }

    // ---------------------------------------------------------------
    // payment_intent.payment_failed → mark order payment as failed
    // ---------------------------------------------------------------
    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const paymentIntentId = intent.id;
      const failureMessage = intent.last_payment_error?.message ?? null;

      const { data: order } = await service
        .from('orders')
        .select('id,user_id')
        .eq('payment_provider_payment_intent', paymentIntentId)
        .maybeSingle();

      if (order) {
        await service
          .from('orders')
          .update({ payment_status: 'failed', status: 'cancelled' })
          .eq('id', order.id);

        await service.from('access_logs').insert({
          user_id: order.user_id,
          action: 'stripe_payment_failed',
          resource_type: 'order',
          resource_id: order.id,
          status_code: 200,
          error_message: failureMessage,
        });
      }
    }

    // ---------------------------------------------------------------
    // charge.refunded → mark order payment as refunded
    // ---------------------------------------------------------------
    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === 'string' ? charge.payment_intent : null;

      if (paymentIntentId) {
        const { data: order } = await service
          .from('orders')
          .select('id,user_id')
          .eq('payment_provider_payment_intent', paymentIntentId)
          .maybeSingle();

        if (order) {
          await service
            .from('orders')
            .update({ payment_status: 'refunded', status: 'cancelled' })
            .eq('id', order.id);

          await service.from('access_logs').insert({
            user_id: order.user_id,
            action: 'stripe_charge_refunded',
            resource_type: 'order',
            resource_id: order.id,
            status_code: 200,
            error_message: null,
          });
        }
      }
    }

    return json({ received: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});
