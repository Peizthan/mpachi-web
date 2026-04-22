import { useAllOrders } from '@/hooks/useAllOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/hooks/useOrders';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ShoppingCart } from 'lucide-react';

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const paymentStatusLabel: Record<string, string> = {
  pending: 'Pago pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
};

export const AllOrdersList = () => {
  const { orders, loading, error, updatingOrderId, updateOrderStatus } = useAllOrders();

  const handleStatusChange = async (orderId: string, value: string) => {
    await updateOrderStatus(orderId, value as Order['status']);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart size={24} />
            Todos los Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">Cargando pedidos...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart size={24} />
            Todos los Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart size={24} />
            Todos los Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">No hay pedidos registrados.</div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart size={24} />
          Todos los Pedidos
        </CardTitle>
        <CardDescription>
          Total: {orders.length} pedidos | Ingresos: ${totalRevenue.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Pedido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Actualizar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === 'cancelled'
                          ? 'destructive'
                          : order.status === 'pending'
                            ? 'secondary'
                            : 'default'
                      }
                    >
                      {statusLabel[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={
                          order.payment_status === 'failed' || order.payment_status === 'refunded'
                            ? 'destructive'
                            : order.payment_status === 'paid'
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {paymentStatusLabel[order.payment_status || 'pending']}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{order.payment_provider || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${order.total_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={order.status}
                      disabled={updatingOrderId === order.id}
                      onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
