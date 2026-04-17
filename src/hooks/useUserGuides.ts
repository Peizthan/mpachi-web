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

interface GuideQueryRow {
  guides: UserGuide | null;
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

        const { data: userOrders, error: ordersError } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', user.id);

        if (ordersError) throw ordersError;

        const orderIds = (userOrders || []).map((order) => order.id);
        if (orderIds.length === 0) {
          setGuides([]);
          return;
        }

        // Obtener guias compradas a traves de order_items -> guides
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
          .in('order_id', orderIds);

        if (fetchError) throw fetchError;

        const uniqueGuides = ((data || []) as GuideQueryRow[])
          .map((item) => item.guides)
          .filter((guide): guide is UserGuide => guide !== null)
          .filter((guide, index, self) => self.findIndex((currentGuide) => currentGuide.id === guide.id) === index);

        setGuides(uniqueGuides);
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
