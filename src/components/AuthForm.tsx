import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AuthForm = () => {
  const { signUp, signIn, signOut, user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
        } else {
          setMessage('¡Registro exitoso! Por favor, verifica tu email para confirmar.');
          setEmail('');
          setPassword('');
          setIsSignUp(false);
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message);
        } else {
          setMessage('¡Inicio de sesión exitoso!');
          setEmail('');
          // Redirige al dashboard después de un pequeño delay
          setTimeout(() => navigate('/dashboard'), 500);
          setPassword('');
        }
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setError('');
    setIsLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        setError(error.message);
      } else {
        setMessage('Sesión cerrada correctamente');
      }
    } finally {
      setIsLoading(false);
    }
  };authL

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>Sesión activa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Email:</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <Button onClick={handleSignOut} disabled={isLoading} className="w-full">
            {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</CardTitle>
        <CardDescription>
          {isSignUp ? 'Regístrate para empezar' : 'Inicia sesión con tu email'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert>
            <AlertDescription className="text-green-700">{message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? isSignUp
                ? 'Registrando...'
                : 'Iniciando sesión...'
              : isSignUp
                ? 'Registrarse'
                : 'Iniciar Sesión'}
          </Button>
        </form>
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMessage('');
            }}
            className="text-sm text-blue-600 hover:underline w-full text-center"
            disabled={isLoading}
          >
            {isSignUp
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
