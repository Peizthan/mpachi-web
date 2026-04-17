import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

export interface StoreGuide {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  slug: string | null;
  price_cents: number;
  currency: string;
}

export const useStoreGuides = () => {
  const [guides, setGuides] = useState<StoreGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreGuides = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('guides')
          .select('id,title,description,image_url,category,slug,price_cents,currency')
          .eq('is_published', true)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setGuides(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar catalogo');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreGuides();
  }, []);

  return { guides, loading, error };
};
