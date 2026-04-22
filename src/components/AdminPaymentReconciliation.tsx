import { useMemo } from 'react';
import { AlertTriangle, RefreshCcw, CheckCircle2, XCircle, Clock, RotateCcw } from 'lucide-react';
import { useAllOrders } from '@/hooks/useAllOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const paymentVariant = (status?: string | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (status === 'paid') return 'default';
  if (status === 'failed') return 'destructive';
  if (status === 'refunded') return 'outline';
  return 'secondary';
};

const PaymentIcon = ({ status }: { status?: string | null }) => {
  if (status === 'paid') return <CheckCircle2 size={14} className="text-green-600" />;
  if (status === 'failed') return <XCircle size={14} className="text-red-600" />;
  if (status === 'refunded') return <RotateCcw size={14} className="text-gray-500" />;
  return <Clock size={14} className="text-yellow-500" />;
};

const statusLabel: Record<string, string> = {
  paid: 'Pagado',
  pending: 'Pendiente',
  failed: 'Fallido',
  refunded: 'Reembolsado',
};

export const AdminPaymentReconciliation = () => {
  const { toast } = useToast();
  const { orders, loading, error, updatingOrderId, updateOrderStatus, refetch } = useAllOrders();

  const { needsAttention, healthy, refunded } = useMemo(() => {
    const needsAttention = orders.filter(
      (o) => o.payment_status === 'failed' || (o.payment_status === 'pending' && o.status !== 'cancelled')
    );
    const refunded = orders.filter((o) => o.payment_status === 'refunded');
    const healthy = orders.filter((o) => o.payment_status === 'paid');
    return { needsAttention, healthy, refunded };
  }, [orders]);

  const handleMarkCancelled = async (orderId: string) => {
    const result = await updateOrderStatus(orderId, 'cancelled');
    if (result.error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el pedido', variant: 'destructive' });
    } else {
      toast({ title: 'Pedido cancelado', description: 'El pedido fue marcado como cancelado.' });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={22} />
            Conciliación de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={22} />
            Conciliación de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-red-600">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 size={15} />
              Pagados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400">{healthy.length}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle size={15} />
              Requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700 dark:text-red-400">{needsAttention.length}</p>
            <p className="text-xs text-muted-foreground">fallidos o pendientes activos</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <RotateCcw size={15} />
              Reembolsados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{refunded.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Needs attention table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle size={20} />
              Requieren atención ({needsAttention.length})
            </CardTitle>
            <CardDescription>
              Pedidos fallidos o pendientes que no han sido cancelados
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refetch} className="flex items-center gap-2">
            <RefreshCcw size={14} />
            Actualizar
          </Button>
        </CardHeader>
        <CardContent>
          {needsAttention.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" />
              Sin pedidos que requieran atención
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado pago</TableHead>
                    <TableHead>Estado pedido</TableHead>
                    <TableHead>Proveedor / Intent</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {needsAttention.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={paymentVariant(order.payment_status)} className="flex w-fit items-center gap-1">
                          <PaymentIcon status={order.payment_status} />
                          {statusLabel[order.payment_status ?? 'pending'] ?? order.payment_status ?? 'Pendiente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{order.status}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        <div>{order.payment_provider ?? '-'}</div>
                        <div className="truncate opacity-60">{order.payment_provider_payment_intent ?? '-'}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status !== 'cancelled' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleMarkCancelled(order.id)}
                          >
                            Cancelar pedido
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refunded table */}
      {refunded.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw size={20} />
              Reembolsados ({refunded.length})
            </CardTitle>
            <CardDescription>Pedidos procesados como reembolso vía Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Proveedor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refunded.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{order.payment_provider ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
