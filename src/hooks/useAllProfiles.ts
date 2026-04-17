import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { Profile } from '@/hooks/useProfile';

export const useAllProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchProfiles();
  }, []);

  const updateUserRole = async (userId: string, role: Profile['role']) => {
    try {
      setUpdatingRoleId(userId);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select('*')
        .single();

      if (updateError) throw updateError;

      setProfiles((prev) => prev.map((profile) => (profile.id === userId ? data : profile)));
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar rol';
      setError(message);
      return { error: err };
    } finally {
      setUpdatingRoleId(null);
    }
  };

  return { profiles, loading, error, updatingRoleId, updateUserRole, refetch: fetchProfiles };
};
