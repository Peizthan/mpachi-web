import { useState } from 'react';
import { Plus, Pencil, RefreshCcw, Tag } from 'lucide-react';
import {
  useAdminDiscountCodes,
  type DiscountCode,
  type DiscountCodeInput,
  getDefaultDiscountInput,
} from '@/hooks/useAdminDiscountCodes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

const mapCodeToInput = (c: DiscountCode): DiscountCodeInput => ({
  code: c.code,
  description: c.description ?? '',
  discount_type: c.discount_type,
  discount_value: c.discount_value,
  currency: c.currency,
  max_uses: c.max_uses == null ? '' : String(c.max_uses),
  valid_from: c.valid_from ? c.valid_from.slice(0, 10) : '',
  valid_until: c.valid_until ? c.valid_until.slice(0, 10) : '',
  is_active: c.is_active,
});

const fmtDiscount = (c: DiscountCode) =>
  c.discount_type === 'percentage'
    ? `${c.discount_value}%`
    : new Intl.NumberFormat('es-ES', { style: 'currency', currency: c.currency.toUpperCase() }).format(
        c.discount_value / 100
      );

export const AdminDiscountCodes = () => {
  const { toast } = useToast();
  const { codes, loading, error, savingId, fetchCodes, createCode, updateCode, toggleActive, deleteCode } =
    useAdminDiscountCodes();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DiscountCode | null>(null);
  const [form, setForm] = useState<DiscountCodeInput>(getDefaultDiscountInput());
  const [formError, setFormError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(getDefaultDiscountInput());
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (c: DiscountCode) => {
    setEditing(c);
    setForm(mapCodeToInput(c));
    setFormError(null);
    setDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const cb = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: cb.checked }));
    } else if (name === 'discount_value') {
      setForm((prev) => ({ ...prev, discount_value: Number(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = (): string | null => {
    if (!form.code.trim()) return 'El código es obligatorio';
    if (form.discount_value <= 0) return 'El valor del descuento debe ser mayor a 0';
    if (form.discount_type === 'percentage' && form.discount_value > 100)
      return 'El porcentaje no puede superar 100';
    if (form.max_uses !== '' && Number(form.max_uses) <= 0)
      return 'Los usos máximos deben ser mayor a 0 o dejarse vacío para ilimitado';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const valError = validate();
    if (valError) { setFormError(valError); return; }

    const result = editing
      ? await updateCode(editing.id, form)
      : await createCode(form);

    if (result.error) {
      setFormError(result.error instanceof Error ? result.error.message : 'No se pudo guardar');
      return;
    }

    toast({
      title: editing ? 'Código actualizado' : 'Código creado',
      description: editing ? 'Los cambios se guardaron.' : `El código "${form.code.trim().toUpperCase()}" ya está disponible.`,
    });
    setDialogOpen(false);
  };

  const handleToggle = async (c: DiscountCode) => {
    const result = await toggleActive(c);
    if (result.error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el estado', variant: 'destructive' });
      return;
    }
    toast({ title: c.is_active ? 'Código desactivado' : 'Código activado' });
  };

  const handleDelete = async (c: DiscountCode) => {
    if (!window.confirm(`¿Eliminar el código "${c.code}"? Esta acción no se puede deshacer.`)) return;
    const result = await deleteCode(c.id);
    if (result.error) {
      toast({ title: 'Error al eliminar', variant: 'destructive' });
      return;
    }
    toast({ title: 'Código eliminado' });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Tag size={22} />Códigos de Descuento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">Cargando códigos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Tag size={22} />Códigos de Descuento</CardTitle>
          <CardDescription>
            Crea códigos que los clientes ingresan al comprar para obtener un descuento automático.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchCodes} className="flex items-center gap-2">
            <RefreshCcw size={16} />Recargar
          </Button>
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus size={16} />Nuevo código
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {codes.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No hay códigos de descuento creados aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Válido hasta</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-mono font-bold">{c.code}</div>
                      {c.description && <div className="text-xs text-muted-foreground">{c.description}</div>}
                    </TableCell>
                    <TableCell className="font-semibold">{fmtDiscount(c)}</TableCell>
                    <TableCell>
                      {c.current_uses}
                      {c.max_uses != null ? ` / ${c.max_uses}` : ' / ∞'}
                    </TableCell>
                    <TableCell>
                      {c.valid_until
                        ? new Date(c.valid_until).toLocaleDateString('es-ES')
                        : 'Sin límite'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.is_active ? 'default' : 'secondary'}>
                        {c.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === c.id}
                          onClick={() => openEdit(c)}
                        >
                          <Pencil size={14} className="mr-1" />Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === c.id}
                          onClick={() => handleToggle(c)}
                        >
                          {c.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={savingId === c.id}
                          onClick={() => handleDelete(c)}
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

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar código' : 'Nuevo código de descuento'}</DialogTitle>
            <DialogDescription>
              El código se aplicará automáticamente al precio en Stripe al pagar.
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
                <label className="text-sm font-medium">Código *</label>
                <Input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="VERANO20"
                  className="font-mono uppercase"
                  required
                />
                <p className="text-xs text-muted-foreground">Se convierte a mayúsculas automáticamente.</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Descripción</label>
                <Input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Promoción de verano 20%"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de descuento *</label>
                <select
                  name="discount_type"
                  value={form.discount_type}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Monto fijo (centavos)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Valor *{' '}
                  <span className="text-muted-foreground font-normal">
                    {form.discount_type === 'percentage' ? '(0–100)' : '(centavos)'}
                  </span>
                </label>
                <Input
                  name="discount_value"
                  type="number"
                  min={1}
                  max={form.discount_type === 'percentage' ? 100 : undefined}
                  value={form.discount_value}
                  onChange={handleChange}
                  required
                />
              </div>

              {form.discount_type === 'fixed' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moneda</label>
                  <Input
                    name="currency"
                    maxLength={3}
                    value={form.currency}
                    onChange={handleChange}
                    placeholder="usd"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Usos máximos</label>
                <Input
                  name="max_uses"
                  type="number"
                  min={1}
                  value={form.max_uses}
                  onChange={handleChange}
                  placeholder="Vacío = ilimitado"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Válido desde</label>
                <Input name="valid_from" type="date" value={form.valid_from} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Válido hasta</label>
                <Input name="valid_until" type="date" value={form.valid_until} onChange={handleChange} />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                Activo (disponible para uso)
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={savingId === 'new' || (!!editing && savingId === editing.id)}
              >
                {savingId ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear código'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
