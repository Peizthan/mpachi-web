import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
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

const ensureProfileClientSide = async (user: User) => {
  const primaryEmail = user.email ?? `${user.id}@local.invalid`;

  const insertProfile = async (email: string) => {
    return supabase
      .from('profiles')
      .insert({
        id: user.id,
        email,
        role: 'user',
      })
      .select('*')
      .single();
  };

  const { data: inserted, error: insertError } = await insertProfile(primaryEmail);
  if (!insertError && inserted) {
    return inserted as Profile;
  }

  // If profile was inserted in another tab/request, use it.
  const { data: existingById, error: existingByIdError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!existingByIdError && existingById) {
    return existingById as Profile;
  }

  // Handle duplicate email constraints by using a deterministic fallback email.
  const errCode = (insertError as { code?: string } | null)?.code;
  const errMessage = (insertError as { message?: string } | null)?.message ?? '';
  const emailConflict =
    errCode === '23505' ||
    errMessage.toLowerCase().includes('duplicate key') ||
    errMessage.includes('profiles_email_key');

  if (emailConflict) {
    const { data: fallbackInserted, error: fallbackError } = await insertProfile(
      `${user.id}@local.invalid`
    );

    if (!fallbackError && fallbackInserted) {
      return fallbackInserted as Profile;
    }
  }

  throw insertError ?? new Error('Profile repair failed');
};

export const useProfile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

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

      await ensureProfileClientSide(user);

      const { data: repairedProfile, error: repairedError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (repairedError) {
        throw repairedError;
      }

      if (!repairedProfile) {
        throw new Error('Profile row is still missing after repair attempt');
      }

      setProfile(repairedProfile);
    } catch (err) {
      const code = (err as { code?: string } | null)?.code;
      const message = err instanceof Error ? err.message : 'Unknown error';
      const diagnostic = code ? `[${code}] ${message}` : message;
      setError(`No se pudo cargar/reparar el perfil: ${diagnostic}`);
      setProfile(null);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

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

  return { profile, loading, error, updateProfile, uploadAvatar, refetchProfile: fetchProfile };
};
