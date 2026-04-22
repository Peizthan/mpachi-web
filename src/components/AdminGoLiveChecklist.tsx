import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCcw, Rocket } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useAdminSiteSettings } from '@/hooks/useAdminSiteSettings';
import { useAdminGuides } from '@/hooks/useAdminGuides';
import { useAllOrders } from '@/hooks/useAllOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CheckItem {
  id: string;
  label: string;
  description: string;
  status: 'ok' | 'warn' | 'error' | 'loading';
}

const StatusIcon = ({ status }: { status: CheckItem['status'] }) => {
  if (status === 'ok') return <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />;
  if (status === 'warn') return <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0" />;
  if (status === 'error') return <XCircle size={18} className="text-red-600 flex-shrink-0" />;
  return <div className="h-4 w-4 rounded-full border-2 border-gray-300 animate-pulse flex-shrink-0" />;
};

const statusVariant = (s: CheckItem['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (s === 'ok') return 'default';
  if (s === 'warn') return 'secondary';
  if (s === 'error') return 'destructive';
  return 'outline';
};

const statusText: Record<CheckItem['status'], string> = {
  ok: 'OK',
  warn: 'Atención',
  error: 'Falta',
  loading: 'Verificando...',
};

export const AdminGoLiveChecklist = () => {
  const { settings, loading: settingsLoading } = useAdminSiteSettings();
  const { guides, loading: guidesLoading } = useAdminGuides();
  const { orders, loading: ordersLoading } = useAllOrders();

  const [stripeEnvOk, setStripeEnvOk] = useState<boolean | null>(null);
  const [supabaseEdgeOk, setSupabaseEdgeOk] = useState<boolean | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Test that Supabase anon key resolves (lightweight auth check)
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const { error } = await supabase.from('guides').select('id').limit(1);
        if (!cancelled) setSupabaseEdgeOk(!error);
      } catch {
        if (!cancelled) setSupabaseEdgeOk(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [refreshKey]);

  // Probe create-checkout-session without auth → expect 401 (edge function is reachable)
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await supabase.functions.invoke('create-checkout-session', {
          body: { guideId: 'probe' },
        });
        // 401 = function is live and auth guard works; any other non-network error also means it's up
        if (!cancelled) setStripeEnvOk(res.error?.message !== 'Failed to send a request to the Edge Function');
      } catch {
        if (!cancelled) setStripeEnvOk(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const checks = useMemo((): CheckItem[] => {
    const loading = settingsLoading || guidesLoading || ordersLoading;

    const publishedGuides = guides.filter((g) => g.is_published && g.is_active);
    const guidesWithContent = guides.filter((g) => g.content && g.content.trim().length > 0);
    const paidOrders = orders.filter((o) => o.payment_status === 'paid');

    return [
      {
        id: 'site_name',
        label: 'Nombre del sitio configurado',
        description: `Valor actual: "${settings.site_name}"`,
        status: loading ? 'loading' : settings.site_name && settings.site_name !== 'MPachi' ? 'ok' : 'warn',
      },
      {
        id: 'contact',
        label: 'Email o WhatsApp de contacto',
        description: settings.contact_email || settings.whatsapp_number
          ? `Email: ${settings.contact_email || '-'} | WA: ${settings.whatsapp_number || '-'}`
          : 'Sin datos de contacto configurados',
        status: loading
          ? 'loading'
          : settings.contact_email || settings.whatsapp_number
          ? 'ok'
          : 'warn',
      },
      {
        id: 'guides_published',
        label: 'Al menos una guía publicada y activa',
        description: loading
          ? 'Verificando...'
          : `${publishedGuides.length} guía(s) publicada(s) y activa(s) de ${guides.length} total`,
        status: loading ? 'loading' : publishedGuides.length > 0 ? 'ok' : 'error',
      },
      {
        id: 'guides_content',
        label: 'Guías con contenido cargado',
        description: loading
          ? 'Verificando...'
          : `${guidesWithContent.length} de ${guides.length} guía(s) tienen contenido`,
        status: loading
          ? 'loading'
          : guides.length === 0
          ? 'error'
          : guidesWithContent.length === guides.length
          ? 'ok'
          : 'warn',
      },
      {
        id: 'supabase_db',
        label: 'Conexión a base de datos (Supabase)',
        description: supabaseEdgeOk === null ? 'Verificando...' : supabaseEdgeOk ? 'Conectado correctamente' : 'Error de conexión',
        status: supabaseEdgeOk === null ? 'loading' : supabaseEdgeOk ? 'ok' : 'error',
      },
      {
        id: 'edge_functions',
        label: 'Edge Functions desplegadas (Stripe checkout)',
        description:
          stripeEnvOk === null
            ? 'Verificando...'
            : stripeEnvOk
            ? 'Función create-checkout-session accesible'
            : 'Función no responde — verificar deployment en Supabase',
        status: stripeEnvOk === null ? 'loading' : stripeEnvOk ? 'ok' : 'error',
      },
      {
        id: 'maintenance_off',
        label: 'Modo mantenimiento desactivado',
        description: settings.maintenance_mode ? 'El sitio está en modo mantenimiento' : 'Sitio visible para usuarios',
        status: loading ? 'loading' : settings.maintenance_mode ? 'warn' : 'ok',
      },
      {
        id: 'social',
        label: 'Redes sociales configuradas',
        description: [settings.instagram_url, settings.facebook_url, settings.tiktok_url].filter(Boolean).length > 0
          ? 'Al menos una red social configurada'
          : 'Sin redes sociales configuradas (opcional)',
        status: loading
          ? 'loading'
          : [settings.instagram_url, settings.facebook_url, settings.tiktok_url].filter(Boolean).length > 0
          ? 'ok'
          : 'warn',
      },
      {
        id: 'first_order',
        label: 'Primera venta completada (prueba end-to-end)',
        description: loading
          ? 'Verificando...'
          : paidOrders.length > 0
          ? `${paidOrders.length} pago(s) confirmado(s) en la plataforma`
          : 'Aún no hay ventas completadas — realiza una compra de prueba',
        status: loading ? 'loading' : paidOrders.length > 0 ? 'ok' : 'warn',
      },
    ];
  }, [settings, guides, orders, settingsLoading, guidesLoading, ordersLoading, supabaseEdgeOk, stripeEnvOk]);

  const okCount = checks.filter((c) => c.status === 'ok').length;
  const errorCount = checks.filter((c) => c.status === 'error').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;
  const readyToLaunch = errorCount === 0 && warnCount === 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className={readyToLaunch ? 'border-green-300 dark:border-green-700' : 'border-yellow-300 dark:border-yellow-700'}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Rocket size={22} />
              Estado de lanzamiento
            </CardTitle>
            <CardDescription>
              {readyToLaunch
                ? '¡Todo listo para lanzar!'
                : `${errorCount} error(es) · ${warnCount} advertencia(s) · ${okCount} OK`}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)} className="flex items-center gap-2">
            <RefreshCcw size={14} />
            Re-verificar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Badge variant="default">{okCount} OK</Badge>
            {warnCount > 0 && <Badge variant="secondary">{warnCount} Advertencia{warnCount !== 1 ? 's' : ''}</Badge>}
            {errorCount > 0 && <Badge variant="destructive">{errorCount} Error{errorCount !== 1 ? 'es' : ''}</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de verificación</CardTitle>
          <CardDescription>Completar todos los puntos antes del lanzamiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checks.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border p-4 transition-colors"
              >
                <StatusIcon status={item.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Badge variant={statusVariant(item.status)} className="text-xs">
                      {statusText[item.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
