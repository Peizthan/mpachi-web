import { useEffect, useState } from 'react';
import { Settings, RefreshCcw, Save } from 'lucide-react';
import { useAdminSiteSettings, type SiteSettings } from '@/hooks/useAdminSiteSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const FIELD_LABELS: { key: keyof SiteSettings; label: string; type?: string; placeholder?: string }[] = [
  { key: 'site_name', label: 'Nombre del sitio', placeholder: 'MPachi' },
  { key: 'site_tagline', label: 'Slogan', placeholder: 'Guías de crianza para familias' },
  { key: 'contact_email', label: 'Email de contacto', type: 'email', placeholder: 'hola@ejemplo.com' },
  { key: 'whatsapp_number', label: 'Número de WhatsApp', placeholder: '+1234567890' },
  { key: 'instagram_url', label: 'URL de Instagram', type: 'url', placeholder: 'https://instagram.com/...' },
  { key: 'facebook_url', label: 'URL de Facebook', type: 'url', placeholder: 'https://facebook.com/...' },
  { key: 'tiktok_url', label: 'URL de TikTok', type: 'url', placeholder: 'https://tiktok.com/...' },
];

export const AdminSiteSettings = () => {
  const { toast } = useToast();
  const { settings, loading, saving, error, saveSettings, refetch } = useAdminSiteSettings();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync settings into form once loaded
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.site_name.trim()) {
      setFormError('El nombre del sitio es obligatorio');
      return;
    }

    const result = await saveSettings(form);
    if (result.error) {
      setFormError(result.error instanceof Error ? result.error.message : 'No se pudo guardar');
      return;
    }

    toast({
      title: 'Configuración guardada',
      description: 'Los ajustes del sitio se actualizaron correctamente.',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={22} />
            Ajustes del Sitio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">Cargando ajustes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Settings size={22} />
            Ajustes del Sitio
          </CardTitle>
          <CardDescription>
            Configura la información y redes sociales del sitio.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} className="flex items-center gap-2">
          <RefreshCcw size={14} />
          Recargar
        </Button>
      </CardHeader>
      <CardContent>
        {(error || formError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{formError ?? error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {FIELD_LABELS.map(({ key, label, type, placeholder }) => (
              <div key={key} className="space-y-2">
                <label htmlFor={key} className="text-sm font-medium">
                  {label}
                </label>
                <Input
                  id={key}
                  name={key}
                  type={type ?? 'text'}
                  value={form[key] as string}
                  onChange={handleChange}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          {/* Maintenance mode toggle */}
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <input
              id="maintenance_mode"
              name="maintenance_mode"
              type="checkbox"
              checked={form.maintenance_mode}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <div>
              <label htmlFor="maintenance_mode" className="text-sm font-medium cursor-pointer">
                Modo mantenimiento
              </label>
              <p className="text-xs text-muted-foreground">
                Cuando está activo, el sitio muestra un aviso de mantenimiento a visitantes.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              <Save size={16} />
              {saving ? 'Guardando...' : 'Guardar ajustes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
