import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Missing Authorization header' }, 401);
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const service = createClient(supabaseUrl, supabaseServiceKey);

    const { data: currentProfile, error: currentProfileError } = await service
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle<ProfileRow>();

    if (currentProfileError) {
      return json({ error: currentProfileError.message }, 500);
    }

    if (currentProfile) {
      return json({ profile: currentProfile });
    }

    const normalizedEmail = user.email ?? `${user.id}@local.invalid`;

    const { data: legacyProfiles, error: legacyProfilesError } = await service
      .from('profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .neq('id', user.id);

    if (legacyProfilesError) {
      return json({ error: legacyProfilesError.message }, 500);
    }

    const preferredLegacyProfile = (legacyProfiles?.[0] ?? null) as ProfileRow | null;

    if (legacyProfiles && legacyProfiles.length > 0) {
      for (const legacyProfile of legacyProfiles) {
        const tombstoneEmail = `legacy+${legacyProfile.id}@local.invalid`;

        const { error: legacyUpdateError } = await service
          .from('profiles')
          .update({ email: tombstoneEmail })
          .eq('id', legacyProfile.id);

        if (legacyUpdateError) {
          return json({ error: legacyUpdateError.message }, 500);
        }
      }
    }

    const profilePayload = {
      id: user.id,
      email: normalizedEmail,
      full_name: preferredLegacyProfile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? null,
      avatar_url: preferredLegacyProfile?.avatar_url ?? (user.user_metadata?.avatar_url as string | undefined) ?? null,
      phone: preferredLegacyProfile?.phone ?? null,
      address: preferredLegacyProfile?.address ?? null,
      city: preferredLegacyProfile?.city ?? null,
      postal_code: preferredLegacyProfile?.postal_code ?? null,
      country: preferredLegacyProfile?.country ?? null,
      role: preferredLegacyProfile?.role ?? 'user',
    };

    const { data: repairedProfile, error: repairedProfileError } = await service
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select('*')
      .single<ProfileRow>();

    if (repairedProfileError || !repairedProfile) {
      return json({ error: repairedProfileError?.message ?? 'Profile repair failed' }, 500);
    }

    await service.from('access_logs').insert({
      user_id: user.id,
      action: 'profile_repaired',
      resource_type: 'profile',
      resource_id: user.id,
      status_code: 200,
      error_message: null,
    });

    return json({ profile: repairedProfile });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});