import { CreditCard, ExternalLink, AlertTriangle, CheckCircle2, Info, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const SUPABASE_PROJECT_REF = 'khrsqcnkedwmuykxkxyn';
const SUPABASE_FUNCTIONS_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1`;

const ENV_VARS = [
  {
    name: 'STRIPE_SECRET_KEY',
    example: 'sk_live_...',
    description: 'Clave secreta de Stripe (Developers → API Keys → Secret key)',
    required: true,
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    example: 'whsec_...',
    description: 'Secreto del webhook de Stripe (Webhooks → signing secret)',
    required: true,
  },
  {
    name: 'SITE_URL',
    example: 'https://mpachi-web.vercel.app',
    description: 'URL pública del sitio (sin barra al final)',
    required: true,
  },
];

const WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'checkout.session.expired',
  'payment_intent.payment_failed',
  'charge.refunded',
];

export const AdminMonetization = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: 'Copiado', description: `${label} copiado al portapapeles` });
    });
  };

  return (
    <div className="space-y-6">
      {/* Status overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={22} />
            Configuración de Pagos (Stripe)
          </CardTitle>
          <CardDescription>
            Configura las variables de entorno en Supabase para activar los pagos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-700">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">Cómo activar los pagos</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              Los pagos se procesan a través de Stripe mediante funciones de Supabase. Sigue los pasos
              a continuación para configurarlos.
            </AlertDescription>
          </Alert>

          {/* Step 1 */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <h3 className="font-semibold">Crear cuenta en Stripe y obtener claves</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-8">
              Accede a{' '}
              <a
                href="https://dashboard.stripe.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                dashboard.stripe.com
              </a>{' '}
              y crea tu cuenta. En <strong>Developers → API Keys</strong> encontrarás tu{' '}
              <code className="bg-muted px-1 rounded text-xs">Secret key</code>.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="ml-8 flex items-center gap-2"
              onClick={() => window.open('https://dashboard.stripe.com/apikeys', '_blank')}
            >
              <ExternalLink size={14} /> Abrir Stripe API Keys
            </Button>
          </div>

          {/* Step 2 */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <h3 className="font-semibold">Configurar variables en Supabase Edge Functions</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-8">
              Ve a{' '}
              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/settings/functions`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Supabase → Settings → Edge Functions → Secrets
              </a>{' '}
              y agrega las siguientes variables:
            </p>
            <div className="ml-8 space-y-2">
              {ENV_VARS.map((v) => (
                <div
                  key={v.name}
                  className="flex items-start justify-between gap-4 rounded-md bg-muted p-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm font-bold">{v.name}</code>
                      {v.required && (
                        <Badge variant="destructive" className="text-xs">
                          Requerido
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{v.description}</p>
                    <p className="text-xs font-mono text-muted-foreground">Ejemplo: {v.example}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(v.name, v.name)}
                  >
                    <Copy size={12} />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-8 flex items-center gap-2"
              onClick={() =>
                window.open(
                  `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/settings/functions`,
                  '_blank'
                )
              }
            >
              <ExternalLink size={14} /> Abrir Supabase Secrets
            </Button>
          </div>

          {/* Step 3 */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <h3 className="font-semibold">Configurar Webhook en Stripe</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-8">
              En Stripe → Developers → Webhooks, agrega el siguiente endpoint:
            </p>
            <div className="ml-8 flex items-center gap-2 rounded-md bg-muted p-3">
              <code className="font-mono text-sm flex-1 break-all">
                {SUPABASE_FUNCTIONS_URL}/stripe-webhook
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  copyToClipboard(`${SUPABASE_FUNCTIONS_URL}/stripe-webhook`, 'URL del webhook')
                }
              >
                <Copy size={12} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground ml-8">
              Selecciona los siguientes eventos para escuchar:
            </p>
            <ul className="ml-8 space-y-1">
              {WEBHOOK_EVENTS.map((ev) => (
                <li key={ev} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                  <code className="font-mono text-xs">{ev}</code>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground ml-8">
              Copia el <strong>Signing Secret</strong> del webhook y agrégalo como{' '}
              <code className="bg-muted px-1 rounded text-xs">STRIPE_WEBHOOK_SECRET</code> en
              Supabase.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="ml-8 flex items-center gap-2"
              onClick={() =>
                window.open('https://dashboard.stripe.com/webhooks/create', '_blank')
              }
            >
              <ExternalLink size={14} /> Crear Webhook en Stripe
            </Button>
          </div>

          {/* Step 4 */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </div>
              <h3 className="font-semibold">Desplegar las Edge Functions</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-8">
              Ejecuta el siguiente comando desde la raíz del proyecto para desplegar las funciones
              con las nuevas variables configuradas:
            </p>
            <div className="ml-8 rounded-md bg-muted p-3 space-y-2">
              <code className="font-mono text-sm block">
                npx supabase functions deploy create-checkout-session
              </code>
              <code className="font-mono text-sm block">
                npx supabase functions deploy stripe-webhook
              </code>
            </div>
          </div>

          {/* Test mode reminder */}
          <Alert className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-700">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-300">Modo de prueba</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-400">
              Usa claves <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-xs">sk_test_...</code>{' '}
              durante las pruebas. Cuando estés listo para producción, reemplaza con las claves{' '}
              <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-xs">sk_live_...</code>.
              Las tarjetas de prueba de Stripe usan el número{' '}
              <strong>4242 4242 4242 4242</strong>.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Quick links */}
      <Card>
        <CardHeader>
          <CardTitle>Links útiles</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
          >
            <ExternalLink size={14} /> Stripe Dashboard
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() =>
              window.open(
                `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}`,
                '_blank'
              )
            }
          >
            <ExternalLink size={14} /> Supabase Dashboard
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() =>
              window.open(
                `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/functions`,
                '_blank'
              )
            }
          >
            <ExternalLink size={14} /> Edge Functions
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
          >
            <ExternalLink size={14} /> Vercel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
