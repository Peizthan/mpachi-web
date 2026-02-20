import { useAllOrders } from '@/hooks/useAllOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export const AllOrdersList = () => {
  const { orders, loading, error } = useAllOrders();

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
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
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
                  <TableCell className="font-semibold">
                    ${order.total_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString('es-ES')}
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
