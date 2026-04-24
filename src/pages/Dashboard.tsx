import { useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, LogOut, ShoppingBag, CheckCircle2, XCircle } from 'lucide-react';
import { ProfileForm } from '@/components/ProfileForm';
import { OrdersList } from '@/components/OrdersList';
import { GuidesList } from '@/components/GuidesList';
import { useProfile } from '@/hooks/useProfile';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const { user, signOut } = useAuthContext();
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');
  const supabaseHost = (() => {
    try {
      return new URL(import.meta.env.VITE_SUPABASE_URL).host;
    } catch {
      return 'invalid_url';
    }
  })();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Clear the query param from URL after reading it
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

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-32 pb-16 px-4">
      <Navigation />
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Bienvenido a tu panel de control</p>
        </div>

        <div className="mb-6 rounded-xl border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">Menú rápido</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => scrollToSection('perfil-section')}>
              Mi perfil
            </Button>
            <Button variant="outline" size="sm" onClick={() => scrollToSection('pedidos-section')}>
              Mis pedidos
            </Button>
            <Button variant="outline" size="sm" onClick={() => scrollToSection('guias-section')}>
              Mis guías
            </Button>
            <Button variant="outline" size="sm" onClick={() => scrollToSection('acciones-section')}>
              Acciones
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-xl border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Diagnóstico de permisos</p>
            <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
              {profile?.role === 'admin' ? 'Admin detectado' : 'Usuario estándar'}
            </Badge>
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <p>
              Supabase host: <span className="font-mono text-foreground">{supabaseHost}</span>
            </p>
            <p>
              Auth user id: <span className="font-mono text-foreground">{user?.id ?? 'sin sesión'}</span>
            </p>
            <p>
              Auth email: <span className="font-mono text-foreground">{user?.email ?? 'sin sesión'}</span>
            </p>
            <p>
              Profile id: <span className="font-mono text-foreground">{profile?.id ?? (profileLoading ? 'cargando...' : 'sin perfil')}</span>
            </p>
            <p>
              Profile role: <span className="font-mono text-foreground">{profile?.role ?? (profileLoading ? 'cargando...' : 'sin rol')}</span>
            </p>
          </div>
          {profileError && (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{profileError}</AlertDescription>
            </Alert>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
              Probar acceso Admin
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Recargar sesión
            </Button>
          </div>
        </div>

        {/* Checkout result banners */}
        {checkoutStatus === 'success' && (
          <Alert className="mb-6 border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800 dark:text-green-300">¡Pago completado!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
              Tu compra fue procesada correctamente. La guía ya está disponible en "Mis Guías" abajo.
            </AlertDescription>
          </Alert>
        )}
        {checkoutStatus === 'cancelled' && (
          <Alert className="mb-6 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
            <XCircle className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-300">Pago cancelado</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-400">
              Cancelaste el proceso de pago. Puedes volver a la tienda cuando quieras.
            </AlertDescription>
          </Alert>
        )}

        {/* Perfil Editable */}
        <div id="perfil-section" className="mb-8 scroll-mt-36">
          <ProfileForm />
        </div>

        {/* Próximas Secciones */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div id="pedidos-section" className="scroll-mt-36">
            <OrdersList />
          </div>
          <div id="guias-section" className="scroll-mt-36">
            <GuidesList />
          </div>
        </div>

        {/* Acciones */}
        <div id="acciones-section" className="flex gap-4 scroll-mt-36">
          <Button onClick={() => navigate('/store')} variant="default" className="flex items-center gap-2">
            <ShoppingBag size={18} />
            Ir a la tienda
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Volver al inicio
          </Button>
          <Button onClick={handleSignOut} variant="destructive" className="flex items-center gap-2">
            <LogOut size={18} />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
