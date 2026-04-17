import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

export interface AccessLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status_code: number | null;
  error_message: string | null;
  created_at: string;
}

export const useAccessLogs = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('access_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (fetchError) throw fetchError;
        setLogs(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar logs de auditoria');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { logs, loading, error };
};
