import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import { useStoreGuides } from '@/hooks/useStoreGuides';
import { supabase } from '@/supabaseClient';

const formatPrice = (priceCents: number, currency: string) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(priceCents / 100);
};

const Store = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { guides, loading, error } = useStoreGuides();
  const [checkoutGuideId, setCheckoutGuideId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const checkoutStatus = searchParams.get('checkout');

  useEffect(() => {
    if (checkoutStatus) {
      const timer = setTimeout(() => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete('checkout');
          return next;
        });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [checkoutStatus, setSearchParams]);

  const startCheckout = async (guideId: string) => {
    try {
      setCheckoutGuideId(guideId);
      setCheckoutError(null);

      const { data, error: invokeError } = await supabase.functions.invoke('create-checkout-session', {
        body: { guideId },
      });

      if (invokeError) throw invokeError;

      if (!data?.url) {
        throw new Error('No se pudo crear la sesion de pago');
      }

      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Error al iniciar pago');
      setCheckoutGuideId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-32 pb-16 px-4">
      <Navigation />
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <ShoppingBag size={36} />
              Tienda
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Compra directa de guias digitales con acceso automatico</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Volver al dashboard
          </Button>
        </div>

        {checkoutStatus === 'cancelled' && (
          <Alert className="mb-6 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
            <XCircle className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-300">Pago cancelado</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-400">
              Cancelaste el proceso de pago. Puedes intentarlo nuevamente cuando quieras.
            </AlertDescription>
          </Alert>
        )}

        {checkoutError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{checkoutError}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-600">Cargando catalogo...</div>
        ) : guides.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Sin productos activos</CardTitle>
              <CardDescription>No hay guias disponibles para compra en este momento.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => {
              const isLoadingCheckout = checkoutGuideId === guide.id;
              return (
                <Card key={guide.id} className="overflow-hidden">
                  {guide.image_url && (
                    <img src={guide.image_url} alt={guide.title} className="w-full h-44 object-cover" />
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{guide.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{guide.description || 'Sin descripcion'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      {guide.category ? <Badge>{guide.category}</Badge> : <span />}
                      <p className="text-xl font-bold">{formatPrice(guide.price_cents, guide.currency)}</p>
                    </div>
                    <Button
                      className="w-full"
                      disabled={isLoadingCheckout}
                      onClick={() => startCheckout(guide.id)}
                    >
                      {isLoadingCheckout ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Redirigiendo...
                        </span>
                      ) : (
                        'Comprar ahora'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
