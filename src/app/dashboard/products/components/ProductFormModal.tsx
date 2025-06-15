import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '../models/product.model';
import { ProductIdentification } from '../models/product-identification.enum';

const UNIT_MEASURE_OPTIONS = [
  { code: '94', label: 'Unidad' },
  { code: '414', label: 'Kilogramo' },
  { code: '449', label: 'Libra' },
  { code: '512', label: 'Metro' },
  { code: '874', label: 'Galón' },
];

const TRIBUTE_OPTIONS = [
  { code: '01', label: 'IVA' },
  { code: '02', label: 'IC' },
  { code: '03', label: 'ICA' },
  { code: '04', label: 'INC' },
  { code: '05', label: 'ReteIVA' },
  { code: '06', label: 'ReteRenta' },
  { code: '07', label: 'ReteICA' },
  { code: '08', label: 'IC Porcentual' },
  { code: '20', label: 'FtoHorticultura' },
  { code: '21', label: 'Timbre' },
  { code: '22', label: 'INC Bolsas' },
  { code: '23', label: 'INCarbono' },
  { code: '24', label: 'INCombustibles' },
  { code: '25', label: 'Sobretasa Combustibles' },
  { code: '26', label: 'Sordicom' },
  { code: '30', label: 'IC Datos' },
];

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: any) => void;
  initialData?: Partial<Product>;
  products?: Product[];
}

const initialForm: Partial<Product> = {
  name: '',
  price: 0,
  unit_measure: '',
  tribute_id: '',
  standard_code_id: 1,
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ open, onClose, onSubmit, initialData, products }) => {
  const [form, setForm] = useState<Partial<Product>>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);

  const productsSafe = products || [];

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...initialForm, ...initialData } : initialForm);
      setError(null);
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generateNextCode = () => {
    const codes = productsSafe
      .map(p => p.code_reference)
      .filter(code => /^PRO\d{4}$/.test(code));
    let max = 0;
    codes.forEach(code => {
      const num = parseInt(code.slice(3), 10);
      if (!isNaN(num) && num > max) max = num;
    });
    const nextNum = (max + 1).toString().padStart(4, '0');
    return `PRO${nextNum}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.unit_measure || !form.tribute_id || !form.standard_code_id) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setError(null);
    let code_reference = form.code_reference;
    if (!initialData || !initialData.code_reference) {
      code_reference = generateNextCode();
    }
    onSubmit({
      ...form,
      code_reference,
      unit_measure: String(form.unit_measure),
      tribute_id: String(form.tribute_id),
      standard_code_id: String(form.standard_code_id),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar producto' : 'Crear producto'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input name="name" id="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="price">Precio</Label>
            <Input name="price" id="price" type="number" value={form.price} onChange={handleChange} min={0} />
          </div>
          <div>
            <Label htmlFor="unit_measure">Unidad de medida</Label>
            <Select value={String(form.unit_measure ?? '')} onValueChange={(v) => handleSelectChange('unit_measure', v)}>
              <SelectTrigger id="unit_measure">
                <SelectValue placeholder="Selecciona una unidad" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_MEASURE_OPTIONS.map((u) => (
                  <SelectItem key={u.code} value={u.code}>{u.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tribute_id">Tributo</Label>
            <Select value={String(form.tribute_id ?? '')} onValueChange={(v) => handleSelectChange('tribute_id', v)}>
              <SelectTrigger id="tribute_id">
                <SelectValue placeholder="Selecciona un tributo" />
              </SelectTrigger>
              <SelectContent>
                {TRIBUTE_OPTIONS.map((t) => (
                  <SelectItem key={t.code} value={t.code}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="standard_code_id">Código estándar</Label>
            <Select value={String(form.standard_code_id)} onValueChange={(v) => handleSelectChange('standard_code_id', v)}>
              <SelectTrigger id="standard_code_id">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ProductIdentification)
                  .filter(([k, v]) => !isNaN(Number(v)))
                  .map(([key, value]) => (
                    <SelectItem key={value} value={String(value)}>{key}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" variant="default">{initialData ? 'Actualizar' : 'Crear'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 