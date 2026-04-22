import { useMemo } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, AlertTriangle, RefreshCcw } from 'lucide-react';
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

const fmt = (cents: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(cents);

const paymentStatusVariant = (status?: string | null): 'default' | 'secondary' | 'destructive' => {
  if (status === 'paid') return 'default';
  if (status === 'failed' || status === 'refunded') return 'destructive';
  return 'secondary';
};

const paymentStatusLabel: Record<string, string> = {
  paid: 'Pagado',
  pending: 'Pendiente',
  failed: 'Fallido',
  refunded: 'Reembolsado',
};

export const AdminSalesReport = () => {
  const { orders, loading, error, refetch } = useAllOrders();

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.payment_status === 'paid');
    const pending = orders.filter((o) => o.payment_status === 'pending' || !o.payment_status);
    const failed = orders.filter((o) => o.payment_status === 'failed');
    const refunded = orders.filter((o) => o.payment_status === 'refunded');

    const totalRevenue = paid.reduce((sum, o) => sum + o.total_amount, 0);
    const pendingRevenue = pending.reduce((sum, o) => sum + o.total_amount, 0);
    const refundedRevenue = refunded.reduce((sum, o) => sum + o.total_amount, 0);

    // This month
    const now = new Date();
    const thisMonthPaid = paid.filter((o) => {
      const d = new Date(o.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisMonthRevenue = thisMonthPaid.reduce((sum, o) => sum + o.total_amount, 0);

    // Last 30 days by day for mini table
    const last30Days = paid
      .filter((o) => {
        const d = new Date(o.created_at);
        return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
      })
      .reduce(
        (acc, o) => {
          const dateKey = new Date(o.created_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
          if (!acc[dateKey]) acc[dateKey] = { count: 0, revenue: 0 };
          acc[dateKey].count += 1;
          acc[dateKey].revenue += o.total_amount;
          return acc;
        },
        {} as Record<string, { count: number; revenue: number }>
      );

    const dailyRows = Object.entries(last30Days)
      .map(([date, vals]) => ({ date, ...vals }))
      .sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);
        return db.getTime() - da.getTime();
      });

    return {
      totalRevenue,
      pendingRevenue,
      refundedRevenue,
      thisMonthRevenue,
      paidCount: paid.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      refundedCount: refunded.length,
      dailyRows,
    };
  }, [orders]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={22} />
            Reporte de Ventas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">Cargando reporte...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={22} />
            Reporte de Ventas
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
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign size={16} />
              Ingresos totales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fmt(stats.totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">{stats.paidCount} pedidos pagados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp size={16} />
              Este mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fmt(stats.thisMonthRevenue)}</p>
            <p className="text-xs text-muted-foreground">pedidos pagados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ShoppingCart size={16} />
              Pendientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fmt(stats.pendingRevenue)}</p>
            <p className="text-xs text-muted-foreground">{stats.pendingCount} pedidos pendientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle size={16} />
              Fallidos / Reembolsos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fmt(stats.refundedRevenue)}</p>
            <p className="text-xs text-muted-foreground">
              {stats.failedCount} fallidos · {stats.refundedCount} reembolsos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All orders table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Todos los pedidos</CardTitle>
            <CardDescription>{orders.length} pedidos registrados en total</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refetch} className="flex items-center gap-2">
            <RefreshCcw size={14} />
            Actualizar
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No hay pedidos aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
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
                        <Badge variant={paymentStatusVariant(order.payment_status)}>
                          {paymentStatusLabel[order.payment_status ?? 'pending'] ?? order.payment_status ?? 'Pendiente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {order.payment_provider ?? '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {fmt(order.total_amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily breakdown last 30 days */}
      {stats.dailyRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ventas diarias (últimos 30 días)</CardTitle>
            <CardDescription>Solo pedidos con pago confirmado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Pedidos</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.dailyRows.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell className="text-right">{row.count}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(row.revenue)}</TableCell>
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
