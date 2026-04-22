import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/supabaseClient';

export interface Profile {
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
}

export const useProfile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener perfil del usuario
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setProfile(data);
          return;
        }

        // If the profile row doesn't exist (e.g. trigger missing for old users), create it on demand.
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email ?? `${user.id}@local.invalid`,
            role: 'user',
          })
          .select('*')
          .single();

        if (insertError) {
          throw insertError;
        }

        setProfile(inserted);
      } catch (err) {
        setError('No se pudo cargar el perfil. Intenta cerrar sesión e iniciar nuevamente.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Actualizar perfil
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(errorMsg);
      return { error: err, data: null };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: new Error('No user logged in'), data: null as string | null };

    try {
      setError(null);

      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = publicData.publicUrl;
      const { error: updateError } = await updateProfile({ avatar_url: avatarUrl });
      if (updateError) throw updateError;

      return { data: avatarUrl, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al subir avatar';
      setError(errorMsg);
      return { error: err, data: null };
    }
  };

  return { profile, loading, error, updateProfile, uploadAvatar };
};
