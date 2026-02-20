import { useOrders, Order } from '@/hooks/useOrders';
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
import { Package } from 'lucide-react';

const statusBadgeVariant: Record<Order['status'], 'default' | 'secondary' | 'destructive'> = {
  pending: 'secondary',
  confirmed: 'default',
  shipped: 'default',
  delivered: 'default',
  cancelled: 'destructive',
};

const statusLabel: Record<Order['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const OrdersList = () => {
  const { orders, loading, error } = useOrders();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={24} />
            Mis Pedidos
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
            <Package size={24} />
            Mis Pedidos
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
            <Package size={24} />
            Mis Pedidos
          </CardTitle>
          <CardDescription>Historial de compras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">
            <p>No tienes pedidos aún.</p>
            <p className="text-sm text-gray-500 mt-2">Los pedidos que realices aparecerán aquí.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package size={24} />
          Mis Pedidos
        </CardTitle>
        <CardDescription>Historial de compras ({orders.length})</CardDescription>
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
                    <Badge variant={statusBadgeVariant[order.status]}>
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
