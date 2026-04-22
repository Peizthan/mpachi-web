import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/supabaseClient';

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  contact_email: string;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  maintenance_mode: boolean;
}

const DEFAULTS: SiteSettings = {
  site_name: 'MPachi',
  site_tagline: 'Guías de crianza para familias',
  contact_email: '',
  whatsapp_number: '',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
  maintenance_mode: false,
};

type RawRow = { key: string; value: string | null };

const rowsToSettings = (rows: RawRow[]): SiteSettings => {
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value ?? '']));
  return {
    site_name: map.site_name ?? DEFAULTS.site_name,
    site_tagline: map.site_tagline ?? DEFAULTS.site_tagline,
    contact_email: map.contact_email ?? DEFAULTS.contact_email,
    whatsapp_number: map.whatsapp_number ?? DEFAULTS.whatsapp_number,
    instagram_url: map.instagram_url ?? DEFAULTS.instagram_url,
    facebook_url: map.facebook_url ?? DEFAULTS.facebook_url,
    tiktok_url: map.tiktok_url ?? DEFAULTS.tiktok_url,
    maintenance_mode: map.maintenance_mode === 'true',
  };
};

export const useAdminSiteSettings = () => {
  const { user } = useAuthContext();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('key,value');
      if (fetchError) throw fetchError;
      setSettings(rowsToSettings((data ?? []) as RawRow[]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (next: SiteSettings) => {
    if (!user) return { error: new Error('Sin sesión activa') };
    try {
      setSaving(true);
      setError(null);

      const rows: { key: string; value: string; updated_at: string; updated_by: string }[] = [
        { key: 'site_name', value: next.site_name, updated_at: new Date().toISOString(), updated_by: user.id },
        { key: 'site_tagline', value: next.site_tagline, updated_at: new Date().toISOString(), updated_by: user.id },
        { key: 'contact_email', value: next.contact_email, updated_at: new Date().toISOString(), updated_by: user.id },
        { key: 'whatsapp_number', value: next.whatsapp_number, updated_at: new Date().toISOString(), updated_by: user.id },
        { key: 'instagram_url', value: next.instagram_url, updated_at: new Date().toISOString(), updated_by: user.id },
        { key: 'facebook_url', value: next.facebook_url, updated_at: new Date().toISOString(), updated_by: user.id },
        { key: 'tiktok_url', value: next.tiktok_url, updated_at: new Date().toISOString(), updated_by: user.id },
        {
          key: 'maintenance_mode',
          value: next.maintenance_mode ? 'true' : 'false',
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        },
      ];

      const { error: upsertError } = await supabase.from('site_settings').upsert(rows, {
        onConflict: 'key',
      });
      if (upsertError) throw upsertError;

      await supabase.from('access_logs').insert({
        user_id: user.id,
        action: 'admin_update_site_settings',
        resource_type: 'site_settings',
        resource_id: null,
        status_code: 200,
        error_message: null,
      });

      setSettings(next);
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar configuración';
      setError(message);
      return { error: err };
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, saving, error, saveSettings, refetch: fetchSettings };
};
