import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/supabaseClient';

export interface PageContentRow {
  key: string;
  value: string;
  label: string;
  section: string;
  updated_at: string;
  updated_by: string | null;
}

export const useAdminPageContent = () => {
  const { user } = useAuthContext();
  const [rows, setRows] = useState<PageContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('page_content')
        .select('key,value,label,section,updated_at,updated_by')
        .order('section')
        .order('key');
      if (fetchError) throw fetchError;
      setRows((data ?? []) as PageContentRow[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar contenido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const saveAll = async (updates: Record<string, string>) => {
    if (!user) return { error: new Error('Sin sesión activa') };
    try {
      setSaving(true);
      setError(null);

      const payload = Object.entries(updates).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      }));

      const { error: upsertError } = await supabase
        .from('page_content')
        .upsert(payload, { onConflict: 'key' });

      if (upsertError) throw upsertError;

      await fetchContent();
      return { error: null };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar contenido');
      return { error: err };
    } finally {
      setSaving(false);
    }
  };

  return { rows, loading, saving, error, fetchContent, saveAll };
};
