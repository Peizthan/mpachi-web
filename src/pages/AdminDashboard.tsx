import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, BarChart3 } from 'lucide-react';
import { AllUsersList } from '@/components/AllUsersList';
import { AllOrdersList } from '@/components/AllOrdersList';

const AdminDashboard = () => {
  const { signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 size={40} />
              Panel Administrativo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestión completa de usuarios, pedidos y más
            </p>
          </div>
          <Button onClick={handleSignOut} variant="destructive" className="flex items-center gap-2">
            <LogOut size={18} />
            Cerrar Sesión
          </Button>
        </div>

        {/* Secciones */}
        <div className="space-y-8">
          {/* Usuario y Pedidos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <AllUsersList />
            </div>
            <div>
              <AllOrdersList />
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">ℹ️ Información del Panel</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✅ Solo los usuarios con rol "admin" pueden acceder a este panel</li>
              <li>✅ Puedes ver todos los usuarios registrados en la plataforma</li>
              <li>✅ Visualiza todos los pedidos realizados y sus estados</li>
              <li>✅ Los datos se cargan desde Supabase con seguridad RLS</li>
              <li>💡 Si no eres admin, serás redireccionado automáticamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
