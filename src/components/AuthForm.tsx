import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const translateAuthError = (message: string) => {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'Email o contraseña incorrectos. Verifica tus datos e intenta nuevamente.';
  }

  if (normalized.includes('email not confirmed')) {
    return 'Debes confirmar tu email antes de iniciar sesion.';
  }

  if (normalized.includes('user already registered')) {
    return 'Este email ya está registrado. Inicia sesión o recupera tu contraseña.';
  }

  if (normalized.includes('password should be at least')) {
    return 'La contraseña es demasiado corta. Usa al menos 6 caracteres.';
  }

  if (normalized.includes('rate limit')) {
    return 'Demasiados intentos. Espera unos minutos antes de volver a intentar.';
  }

  return 'No se pudo completar la operacion. Intenta nuevamente.';
};

export const AuthForm = () => {
  const { signUp, signIn, signOut, user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [awaitingEmailConfirmation, setAwaitingEmailConfirmation] = useState(false);
  const [lastSignupEmail, setLastSignupEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(translateAuthError(signUpError.message));
        } else {
          const emailNeedsConfirmation = !data.session;

          if (emailNeedsConfirmation) {
            setAwaitingEmailConfirmation(true);
            setLastSignupEmail(email);
            setMessage('Te enviamos un email de confirmación. Revisa tu bandeja para activar tu cuenta.');
          } else {
            setMessage('Cuenta creada correctamente. Ya puedes continuar.');
            setTimeout(() => navigate('/dashboard'), 500);
          }

          setEmail('');
          setPassword('');
          setIsSignUp(false);
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(translateAuthError(signInError.message));
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

  const handleResendConfirmation = async () => {
    const targetEmail = email || lastSignupEmail;
    if (!targetEmail) {
      setError('Ingresa el email que registraste para reenviar la confirmación.');
      return;
    }

    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
      });

      if (resendError) {
        setError(translateAuthError(resendError.message));
      } else {
        setMessage('Email de confirmación reenviado correctamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Ingresa tu email para recuperar la contraseña.');
      return;
    }

    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (resetError) {
        setError(translateAuthError(resetError.message));
      } else {
        setMessage('Te enviamos un email para restablecer tu contraseña.');
      }
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
  };

  const handlePasswordResetForCurrentUser = async () => {
    const targetEmail = user?.email;
    if (!targetEmail) {
      setError('No se encontro un email de sesion activa para recuperar la contrasena.');
      return;
    }

    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (resetError) {
        setError(translateAuthError(resetError.message));
      } else {
        setMessage('Te enviamos un email para restablecer tu contraseña.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>Sesión activa. También puedes recuperar tu contraseña desde aquí.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Email:</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handlePasswordResetForCurrentUser}
            disabled={isLoading}
            className="w-full"
          >
            Recuperar contraseña
          </Button>
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

        {awaitingEmailConfirmation && (
          <Alert>
            <AlertDescription>
              Tu cuenta necesita confirmación por email. Si no recibiste el correo, puedes reenviarlo.
            </AlertDescription>
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

          {!isSignUp && (
            <button
              type="button"
              className="w-full text-left text-sm text-blue-600 hover:underline"
              disabled={isLoading}
              onClick={handlePasswordReset}
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? isSignUp
                ? 'Registrando...'
                : 'Iniciando sesión...'
              : isSignUp
                ? 'Registrarse'
                : 'Iniciar Sesión'}
          </Button>

          {awaitingEmailConfirmation && (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              disabled={isLoading}
              onClick={handleResendConfirmation}
            >
              Reenviar email de confirmación
            </Button>
          )}
        </form>
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMessage('');
              if (!isSignUp) {
                setAwaitingEmailConfirmation(false);
              }
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
