import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { Order } from '@/hooks/useOrders';
import { useAuthContext } from '@/context/AuthContext';

export const useAllOrders = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pedidos');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setUpdatingOrderId(orderId);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select('*')
        .single();

      if (updateError) throw updateError;

      await supabase.from('access_logs').insert({
        user_id: user?.id || null,
        action: 'admin_update_order_status',
        resource_type: 'order',
        resource_id: orderId,
        status_code: 200,
        error_message: null,
      });

      setOrders((prev) => prev.map((order) => (order.id === orderId ? data : order)));
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar pedido';
      setError(message);
      return { error: err };
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return { orders, loading, error, updatingOrderId, updateOrderStatus, refetch: fetchOrders };
};
