import { useMemo, useState } from 'react';
import { Pencil, Plus, RefreshCcw } from 'lucide-react';
import { useAdminGuides, type AdminGuide, type GuideFormInput } from '@/hooks/useAdminGuides';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const getDefaultForm = (): GuideFormInput => ({
  title: '',
  description: '',
  content: '',
  image_url: '',
  category: '',
  slug: '',
  price_cents: 990,
  currency: 'usd',
  is_published: false,
  is_active: true,
});

const mapGuideToForm = (guide: AdminGuide): GuideFormInput => ({
  title: guide.title,
  description: guide.description || '',
  content: guide.content || '',
  image_url: guide.image_url || '',
  category: guide.category || '',
  slug: guide.slug || '',
  price_cents: guide.price_cents,
  currency: guide.currency,
  is_published: guide.is_published,
  is_active: guide.is_active,
});

const formatPrice = (priceCents: number, currency: string) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(priceCents / 100);

export const AdminGuidesManager = () => {
  const { toast } = useToast();
  const {
    guides,
    loading,
    error,
    savingGuideId,
    createGuide,
    updateGuide,
    deleteGuide,
    togglePublished,
    toggleActive,
    refetch,
  } = useAdminGuides();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<AdminGuide | null>(null);
  const [formData, setFormData] = useState<GuideFormInput>(getDefaultForm());
  const [formError, setFormError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const publishedCount = guides.filter((guide) => guide.is_published).length;
    const activeCount = guides.filter((guide) => guide.is_active).length;
    return { publishedCount, activeCount };
  }, [guides]);

  const openCreateDialog = () => {
    setEditingGuide(null);
    setFormData(getDefaultForm());
    setFormError(null);
    setDialogOpen(true);
  };

  const openEditDialog = (guide: AdminGuide) => {
    setEditingGuide(guide);
    setFormData(mapGuideToForm(guide));
    setFormError(null);
    setDialogOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === 'price_cents') {
      const priceValue = Number.parseInt(value, 10);
      setFormData((prev) => ({ ...prev, price_cents: Number.isNaN(priceValue) ? 0 : priceValue }));
      return;
    }

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checkbox.checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'El titulo es obligatorio';
    if (formData.price_cents <= 0) return 'El precio debe ser mayor a 0';
    if (!formData.currency.trim()) return 'La moneda es obligatoria';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const result = editingGuide
      ? await updateGuide(editingGuide.id, formData)
      : await createGuide(formData);

    if (result.error) {
      setFormError(result.error instanceof Error ? result.error.message : 'No se pudo guardar la guia');
      return;
    }

    toast({
      title: editingGuide ? 'Guia actualizada' : 'Guia creada',
      description: editingGuide
        ? 'Los cambios se guardaron correctamente.'
        : 'La nueva guia se agrego al catalogo.',
    });

    setDialogOpen(false);
  };

  const handleTogglePublished = async (guide: AdminGuide) => {
    const result = await togglePublished(guide);
    if (result.error) {
      toast({
        title: 'No se pudo actualizar',
        description: result.error instanceof Error ? result.error.message : 'Error inesperado',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: guide.is_published ? 'Guia despublicada' : 'Guia publicada',
      description: guide.is_published
        ? 'La guia ya no es visible en tienda.'
        : 'La guia ya puede mostrarse en tienda.',
    });
  };

  const handleToggleActive = async (guide: AdminGuide) => {
    const result = await toggleActive(guide);
    if (result.error) {
      toast({
        title: 'No se pudo actualizar',
        description: result.error instanceof Error ? result.error.message : 'Error inesperado',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: guide.is_active ? 'Guia desactivada' : 'Guia activada',
      description: guide.is_active
        ? 'La guia no estara disponible para venta.'
        : 'La guia vuelve a estar disponible para venta.',
    });
  };

  const handleDeleteGuide = async (guide: AdminGuide) => {
    const confirmed = window.confirm(`¿Seguro que deseas eliminar la guía "${guide.title}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    const result = await deleteGuide(guide.id);
    if (result.error) {
      toast({
        title: 'No se pudo eliminar',
        description: result.error instanceof Error ? result.error.message : 'Error inesperado',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Guia eliminada',
      description: 'La guia se elimino correctamente del catalogo.',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Catalogo de Guias</CardTitle>
          <CardDescription>Cargando guias...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Catalogo de Guias</CardTitle>
          <CardDescription>
            Total: {guides.length} | Publicadas: {stats.publishedCount} | Activas: {stats.activeCount}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refetch} className="flex items-center gap-2">
            <RefreshCcw size={16} />
            Recargar
          </Button>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus size={16} />
            Nueva guia
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {guides.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No hay guias creadas aun.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Actualizado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guides.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell className="font-medium">
                      <div>{guide.title}</div>
                      <div className="text-xs text-muted-foreground">/{guide.slug || 'sin-slug'}</div>
                    </TableCell>
                    <TableCell>{guide.category || '-'}</TableCell>
                    <TableCell>{formatPrice(guide.price_cents, guide.currency)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={guide.is_published ? 'default' : 'secondary'}>
                          {guide.is_published ? 'Publicada' : 'Borrador'}
                        </Badge>
                        <Badge variant={guide.is_active ? 'default' : 'outline'}>
                          {guide.is_active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(guide.updated_at).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(guide)}>
                          <Pencil size={14} className="mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingGuideId === guide.id}
                          onClick={() => handleTogglePublished(guide)}
                        >
                          {guide.is_published ? 'Despublicar' : 'Publicar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingGuideId === guide.id}
                          onClick={() => handleToggleActive(guide)}
                        >
                          {guide.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={savingGuideId === guide.id}
                          onClick={() => handleDeleteGuide(guide)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingGuide ? 'Editar guia' : 'Nueva guia'}</DialogTitle>
            <DialogDescription>
              Define contenido, publicacion y datos de venta para la guia.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Titulo
                </label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug
                </label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="se-completa-con-el-titulo-si-vacio"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Categoria
                </label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label htmlFor="price_cents" className="text-sm font-medium">
                  Precio (centavos)
                </label>
                <Input
                  id="price_cents"
                  name="price_cents"
                  type="number"
                  min={1}
                  value={formData.price_cents}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="currency" className="text-sm font-medium">
                  Moneda
                </label>
                <Input
                  id="currency"
                  name="currency"
                  maxLength={3}
                  value={formData.currency}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="image_url" className="text-sm font-medium">
                  URL de imagen
                </label>
                <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descripcion
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Contenido de la guia
                </label>
                <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={8} />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 border-t pt-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                />
                Publicada
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                Activa para venta
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={savingGuideId === 'new' || (!!editingGuide && savingGuideId === editingGuide.id)}>
                {savingGuideId ? 'Guardando...' : editingGuide ? 'Guardar cambios' : 'Crear guia'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
