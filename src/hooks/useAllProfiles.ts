import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { Profile } from '@/hooks/useProfile';

export const useAllProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setProfiles(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar perfiles');
        console.error('Error fetching profiles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return { profiles, loading, error };
};
