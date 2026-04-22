import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/supabaseClient';

export interface AdminGuide {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  category: string | null;
  slug: string | null;
  price_cents: number;
  currency: string;
  is_published: boolean;
  is_active: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface GuideFormInput {
  title: string;
  description: string;
  content: string;
  image_url: string;
  category: string;
  slug: string;
  price_cents: number;
  currency: string;
  is_published: boolean;
  is_active: boolean;
}

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const normalizeCurrency = (value: string) => value.trim().toLowerCase().slice(0, 3) || 'usd';

const mapInputToPayload = (input: GuideFormInput) => ({
  title: input.title.trim(),
  description: input.description.trim() || null,
  content: input.content.trim() || null,
  image_url: input.image_url.trim() || null,
  category: input.category.trim() || null,
  slug: normalizeSlug(input.slug || input.title) || null,
  price_cents: input.price_cents,
  currency: normalizeCurrency(input.currency),
  is_published: input.is_published,
  is_active: input.is_active,
});

export const useAdminGuides = () => {
  const { user } = useAuthContext();
  const [guides, setGuides] = useState<AdminGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingGuideId, setSavingGuideId] = useState<string | null>(null);

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('guides')
        .select(
          'id,title,description,content,image_url,category,slug,price_cents,currency,is_published,is_active,author_id,created_at,updated_at'
        )
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setGuides((data || []) as AdminGuide[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar guias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const createGuide = async (input: GuideFormInput) => {
    if (!user) {
      return { error: new Error('No hay sesion activa') };
    }

    try {
      setSavingGuideId('new');
      setError(null);

      const payload = mapInputToPayload(input);
      const { data, error: createError } = await supabase
        .from('guides')
        .insert({ ...payload, author_id: user.id })
        .select(
          'id,title,description,content,image_url,category,slug,price_cents,currency,is_published,is_active,author_id,created_at,updated_at'
        )
        .single();

      if (createError) throw createError;

      await supabase.from('access_logs').insert({
        user_id: user.id,
        action: 'admin_create_guide',
        resource_type: 'guide',
        resource_id: data.id,
        status_code: 200,
        error_message: null,
      });

      setGuides((prev) => [data as AdminGuide, ...prev]);
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear guia';
      setError(message);
      return { error: err };
    } finally {
      setSavingGuideId(null);
    }
  };

  const updateGuide = async (guideId: string, input: GuideFormInput) => {
    try {
      setSavingGuideId(guideId);
      setError(null);

      const payload = mapInputToPayload(input);
      const { data, error: updateError } = await supabase
        .from('guides')
        .update(payload)
        .eq('id', guideId)
        .select(
          'id,title,description,content,image_url,category,slug,price_cents,currency,is_published,is_active,author_id,created_at,updated_at'
        )
        .single();

      if (updateError) throw updateError;

      await supabase.from('access_logs').insert({
        user_id: user?.id || null,
        action: 'admin_update_guide',
        resource_type: 'guide',
        resource_id: guideId,
        status_code: 200,
        error_message: null,
      });

      setGuides((prev) => prev.map((guide) => (guide.id === guideId ? (data as AdminGuide) : guide)));
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar guia';
      setError(message);
      return { error: err };
    } finally {
      setSavingGuideId(null);
    }
  };

  const deleteGuide = async (guideId: string) => {
    try {
      setSavingGuideId(guideId);
      setError(null);

      const { error: deleteError } = await supabase.from('guides').delete().eq('id', guideId);
      if (deleteError) throw deleteError;

      await supabase.from('access_logs').insert({
        user_id: user?.id || null,
        action: 'admin_delete_guide',
        resource_type: 'guide',
        resource_id: guideId,
        status_code: 200,
        error_message: null,
      });

      setGuides((prev) => prev.filter((guide) => guide.id !== guideId));
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar guia';
      setError(message);
      return { error: err };
    } finally {
      setSavingGuideId(null);
    }
  };

  const togglePublished = async (guide: AdminGuide) => {
    return updateGuide(guide.id, {
      title: guide.title,
      description: guide.description || '',
      content: guide.content || '',
      image_url: guide.image_url || '',
      category: guide.category || '',
      slug: guide.slug || '',
      price_cents: guide.price_cents,
      currency: guide.currency,
      is_published: !guide.is_published,
      is_active: guide.is_active,
    });
  };

  const toggleActive = async (guide: AdminGuide) => {
    return updateGuide(guide.id, {
      title: guide.title,
      description: guide.description || '',
      content: guide.content || '',
      image_url: guide.image_url || '',
      category: guide.category || '',
      slug: guide.slug || '',
      price_cents: guide.price_cents,
      currency: guide.currency,
      is_published: guide.is_published,
      is_active: !guide.is_active,
    });
  };

  return {
    guides,
    loading,
    error,
    savingGuideId,
    createGuide,
    updateGuide,
    deleteGuide,
    togglePublished,
    toggleActive,
    refetch: fetchGuides,
  };
};
