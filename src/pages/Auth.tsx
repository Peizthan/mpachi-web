import { AuthForm } from '@/components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
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
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
