import { ShieldCheck } from 'lucide-react';
import { useAccessLogs } from '@/hooks/useAccessLogs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const AccessLogsList = () => {
  const { logs, loading, error } = useAccessLogs();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck size={24} />
            Auditoria Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">Cargando logs...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck size={24} />
            Auditoria Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck size={24} />
          Auditoria Reciente
        </CardTitle>
        <CardDescription>Ultimos 50 eventos de acceso y acciones criticas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Accion</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.resource_type || '-'}</TableCell>
                  <TableCell>{log.status_code || '-'}</TableCell>
                  <TableCell>{new Date(log.created_at).toLocaleString('es-ES')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
