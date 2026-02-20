import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { ProfileForm } from '@/components/ProfileForm';
import { OrdersList } from '@/components/OrdersList';
import { GuidesList } from '@/components/GuidesList';

const Dashboard = () => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Bienvenido a tu panel de control</p>
        </div>

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
