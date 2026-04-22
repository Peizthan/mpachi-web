import { useEffect, useState } from 'react';
import { FileText, RefreshCcw, Save } from 'lucide-react';
import { useAdminPageContent } from '@/hooks/useAdminPageContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const SECTION_LABELS: Record<string, string> = {
  home: 'Héroe / Inicio',
  about: 'Sobre Mí',
  consultations: 'Consultas',
  blog: 'Blog',
};

const MULTILINE_KEYS = new Set([
  'hero_description',
  'about_bio_1',
  'about_bio_2',
  'about_bio_3',
  'consultations_subtitle',
  'blog_subtitle',
  'blog_post_1_body',
  'blog_post_2_body',
  'blog_post_3_body',
]);

export const AdminPageContent = () => {
  const { toast } = useToast();
  const { rows, loading, saving, error, fetchContent, saveAll } = useAdminPageContent();
  const [form, setForm] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    setForm(map);
  }, [rows]);

  const sections = [...new Set(rows.map((r) => r.section))].sort();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (sectionKeys: string[]) => {
    setFormError(null);
    const updates: Record<string, string> = {};
    for (const key of sectionKeys) {
      if (form[key] !== undefined) updates[key] = form[key];
    }

    const result = await saveAll(updates);
    if (result.error) {
      setFormError(result.error instanceof Error ? result.error.message : 'No se pudo guardar');
      return;
    }
    toast({ title: 'Contenido guardado', description: 'Los cambios se publicaron correctamente.' });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={22} /> Contenido de la Página
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">Cargando contenido...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText size={22} />
            Contenido de la Página
          </CardTitle>
          <CardDescription>
            Edita los textos del sitio. Los cambios se reflejan en la página principal.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchContent} className="flex items-center gap-2">
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

        <Tabs defaultValue={sections[0] ?? 'home'} className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1">
            {sections.map((sec) => (
              <TabsTrigger key={sec} value={sec}>
                {SECTION_LABELS[sec] ?? sec}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((sec) => {
            const sectionRows = rows.filter((r) => r.section === sec);
            const sectionKeys = sectionRows.map((r) => r.key);

            return (
              <TabsContent key={sec} value={sec} className="space-y-4">
                <div className="space-y-4">
                  {sectionRows.map((row) => (
                    <div key={row.key} className="space-y-1">
                      <label className="text-sm font-medium text-foreground">
                        {row.label || row.key}
                      </label>
                      <p className="text-xs text-muted-foreground font-mono">{row.key}</p>
                      {MULTILINE_KEYS.has(row.key) ? (
                        <Textarea
                          value={form[row.key] ?? ''}
                          onChange={(e) => handleChange(row.key, e.target.value)}
                          rows={row.key.startsWith('about_bio') ? 4 : 2}
                          className="resize-y"
                        />
                      ) : (
                        <Input
                          value={form[row.key] ?? ''}
                          onChange={(e) => handleChange(row.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <Button
                    onClick={() => handleSave(sectionKeys)}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <Save size={16} />
                    {saving ? 'Guardando...' : `Guardar ${SECTION_LABELS[sec] ?? sec}`}
                  </Button>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
