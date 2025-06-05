// hooks/useClientForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Esquema SIN los campos que maneja clientData
const clientSchema = z.object({
  identification: z.string().min(1, 'La identificación es requerida'),
  dv: z.number().optional(),
  company: z.string().optional(),
  trade_name: z.string().optional(),
  names: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  address: z.string().min(1, 'La dirección es requerida'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^3[0-9]{9}$/, 'El teléfono debe tener 10 dígitos y comenzar con 3'),
  department: z.string().min(1, 'El departamento es requerido'),
  municipality_name: z.string().min(1, 'El municipio es requerido'),
  municipality_id: z.number().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export function useClientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      identification: '',
      names: '',
      address: '',
      email: '',
      phone: '',
      department: '',
      municipality_name: '',
    },
  });

  // Función para resetear el formulario con valores numéricos
  const resetForm = () => {
    form.reset({
      identification: '',
      names: '',
      address: '',
      email: '',
      phone: '',
      department: '',
      municipality_name: '',
    });
  };

  return { 
    form, 
    isSubmitting, 
    setIsSubmitting, 
    resetForm
  };
}