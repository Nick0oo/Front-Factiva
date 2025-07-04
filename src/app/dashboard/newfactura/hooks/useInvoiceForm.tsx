import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { type Customer } from '../models/CustomerModal';

// Esquema de validación para el formulario
export const formSchema = z.object({
  numbering_range_id: z.string().min(1, 'Requerido'),
  reference_code: z.string().min(1, 'Requerido'),
  observation: z.string().optional(),
  payment_method_code: z.string().min(1, 'Requerido'),
  tribute_id: z.string().min(1, 'El régimen de IVA es requerido'),
});

// Tipo exportado basado en el esquema
export type FormValues = z.infer<typeof formSchema>;

export function useInvoiceForm() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [custOpen, setCustOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numbering_range_id: '',
      reference_code: '',
      observation: '',
      payment_method_code: '',
      tribute_id: '',
    },
  });

  // Generar automáticamente el reference_code al montar el formulario
  useEffect(() => {
    const fecha = new Date();
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    // Simulación: número aleatorio, deberías pedir el correlativo real al backend
    const n = Math.floor(Math.random() * 1000) + 1;
    const ref = `FA-${yyyy}${mm}${dd}-${n}`;
    form.setValue('reference_code', ref);
  }, []);

  return {
    form,
    router,
    customer,
    setCustomer,
    custOpen,
    setCustOpen,
  };
}