import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/supabaseClient';

export interface UserGuide {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export const useUserGuides = () => {
  const { user } = useAuthContext();
  const [guides, setGuides] = useState<UserGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchGuides = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener guías que el usuario ha comprado (a través de order_items)
        const { data, error: fetchError } = await supabase
          .from('order_items')
          .select(`
            guide_id,
            guides:guide_id (
              id,
              title,
              description,
              image_url,
              category,
              author_id,
              created_at,
              updated_at
            )
          `)
          .eq('orders.user_id', user.id);

        if (fetchError) {
          // Si la consulta anterior falla, obtener solo guías publicadas del autor
          const { data: authorGuides, error: authorError } = await supabase
            .from('guides')
            .select('*')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false });

          if (authorError) throw authorError;
          setGuides(authorGuides || []);
        } else {
          // Filtrar y mapear guías únicas
          const uniqueGuides = (data || [])
            .map((item: any) => item.guides)
            .filter((guide: any, index: number, self: any[]) =>
              guide && self.findIndex((g) => g.id === guide.id) === index
            );
          setGuides(uniqueGuides);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar guías');
        console.error('Error fetching guides:', err);
        // Operación fallida, mostrar guías vacías
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [user]);

  return { guides, loading, error };
};
