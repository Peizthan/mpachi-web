import { AuthForm } from '@/components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 pt-32 pb-8">
      <Navigation />
      <div className="w-full max-w-md">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Button>
        <div className="text-center mb-8">
          <img src="/assets/brand-logo.png" alt="mpachi Logo" width={80} height={80} className="mx-auto mb-4 drop-shadow-lg" />
          <p className="text-gray-400">Plataforma de guías y educación</p>
        </div>
        <div className="mb-4 rounded-md border border-slate-600 bg-slate-800/70 p-3 text-sm text-slate-200">
          Si olvidaste tu contraseña, ingresa tu email y presiona el boton "Recuperar contraseña".
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
