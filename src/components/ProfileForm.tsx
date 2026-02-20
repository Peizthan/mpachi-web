import { useState } from 'react';
import { useProfile, Profile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check } from 'lucide-react';

interface ProfileFormProps {
  onSuccess?: () => void;
}

export const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  const { profile, loading, error: profileError, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  // Inicializar form data cuando se cargue el perfil
  const handleEditClick = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '',
      });
      setIsEditing(true);
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const { error } = await updateProfile(formData);
    
    setIsSaving(false);
    if (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al guardar');
    } else {
      setSubmitSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSubmitSuccess(false), 3000);
      onSuccess?.();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando perfil...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8 text-red-600">No se pudo cargar el perfil</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>Actualiza tu información de perfil</CardDescription>
      </CardHeader>
      <CardContent>
        {profileError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{profileError}</AlertDescription>
          </Alert>
        )}

        {submitError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {submitSuccess && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
            <Check className="h-4 w-4" />
            <AlertDescription>Perfil actualizado correctamente</AlertDescription>
          </Alert>
        )}

        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre Completo</label>
                <p className="text-lg font-semibold mt-1">{profile.full_name || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                <p className="text-lg font-semibold mt-1">{profile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono</label>
                <p className="text-lg font-semibold mt-1">{profile.phone || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">País</label>
                <p className="text-lg font-semibold mt-1">{profile.country || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Ciudad</label>
                <p className="text-lg font-semibold mt-1">{profile.city || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Código Postal</label>
                <p className="text-lg font-semibold mt-1">{profile.postal_code || 'No especificado'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Dirección</label>
              <p className="text-lg font-semibold mt-1">{profile.address || 'No especificado'}</p>
            </div>
            <Button onClick={handleEditClick} className="mt-4">
              Editar Perfil
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="text-sm font-medium">Nombre Completo</label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name || ''}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium">Email (no editable)</label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium">Teléfono</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="+34 123 456 789"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-medium">Dirección</label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address || ''}
                onChange={handleChange}
                placeholder="Tu dirección completa"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="text-sm font-medium">Ciudad</label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city || ''}
                  onChange={handleChange}
                  placeholder="Tu ciudad"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="postal_code" className="text-sm font-medium">Código Postal</label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  value={formData.postal_code || ''}
                  onChange={handleChange}
                  placeholder="12345"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="text-sm font-medium">País</label>
              <Input
                id="country"
                name="country"
                type="text"
                value={formData.country || ''}
                onChange={handleChange}
                placeholder="Tu país"
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
