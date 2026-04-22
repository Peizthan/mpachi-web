import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Loader2, XCircle, Tag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
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
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
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

  const validateCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    try {
      setValidatingCoupon(true);
      setCouponError(null);

      const { data, error: fetchError } = await supabase
        .from('discount_codes')
        .select('code,discount_type,discount_value,is_active,valid_until,max_uses,current_uses')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (fetchError || !data) {
        setCouponError('Código inválido o expirado.');
        setCouponApplied(false);
        return;
      }

      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        setCouponError('Este código ha expirado.');
        setCouponApplied(false);
        return;
      }

      if (data.max_uses != null && data.current_uses >= data.max_uses) {
        setCouponError('Este código ya alcanzó su límite de usos.');
        setCouponApplied(false);
        return;
      }

      setCouponApplied(true);
    } catch {
      setCouponError('No se pudo validar el código. Intenta más tarde.');
      setCouponApplied(false);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const startCheckout = async (guideId: string) => {
    try {
      setCheckoutGuideId(guideId);
      setCheckoutError(null);

      const { data, error: invokeError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          guideId,
          couponCode: couponApplied && couponCode.trim() ? couponCode.trim().toUpperCase() : undefined,
        },
      });

      if (invokeError) throw invokeError;

      if (!data?.url) {
        throw new Error('No se pudo crear la sesión de pago');
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
            <p className="text-gray-600 dark:text-gray-400">Compra directa de guías digitales con acceso automático</p>
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

        <div className="mb-6 p-4 rounded-lg border bg-card">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Tag size={14} />
            ¿Tienes un código de descuento?
          </p>
          <div className="flex gap-2 max-w-sm">
            <Input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setCouponApplied(false);
                setCouponError(null);
              }}
              placeholder="CÓDIGO"
              className="font-mono uppercase"
              disabled={validatingCoupon}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void validateCoupon();
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => void validateCoupon()}
              disabled={!couponCode.trim() || validatingCoupon || couponApplied}
            >
              {validatingCoupon ? <Loader2 size={16} className="animate-spin" /> : 'Aplicar'}
            </Button>
          </div>
          {couponApplied && (
            <p className="mt-1.5 text-sm text-green-600 flex items-center gap-1">
              <CheckCircle2 size={14} />
              Código <span className="font-mono font-bold">{couponCode}</span> aplicado. El descuento se reflejará en el pago.
            </p>
          )}
          {couponError && <p className="mt-1.5 text-sm text-destructive">{couponError}</p>}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-600">Cargando catálogo...</div>
        ) : guides.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Sin productos activos</CardTitle>
              <CardDescription>No hay guías disponibles para compra en este momento.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => {
              const isLoadingCheckout = checkoutGuideId === guide.id;
              return (
                <Card key={guide.id} className="overflow-hidden">
                  {guide.image_url && <img src={guide.image_url} alt={guide.title} className="w-full h-44 object-cover" />}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{guide.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{guide.description || 'Sin descripción'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      {guide.category ? <Badge>{guide.category}</Badge> : <span />}
                      <p className="text-xl font-bold">{formatPrice(guide.price_cents, guide.currency)}</p>
                    </div>
                    {couponApplied && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Tag size={11} />
                        Código de descuento activo
                      </p>
                    )}
                    <Button className="w-full" disabled={isLoadingCheckout} onClick={() => void startCheckout(guide.id)}>
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
