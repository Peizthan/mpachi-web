import { useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, LogOut, ShoppingBag, CheckCircle2, XCircle } from 'lucide-react';
import { ProfileForm } from '@/components/ProfileForm';
import { OrdersList } from '@/components/OrdersList';
import { GuidesList } from '@/components/GuidesList';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');

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
        <div className="mb-8">
          <ProfileForm />
        </div>

        {/* Próximas Secciones */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <OrdersList />
          <GuidesList />
        </div>

        {/* Acciones */}
        <div className="flex gap-4">
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
