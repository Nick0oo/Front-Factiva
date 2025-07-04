import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { type FormValues } from './useInvoiceForm';
import { type Customer } from '../models/CustomerModal';
import { type Item } from '../models/ItemsModal';
import api from '@/lib/axios';
import dayjs from 'dayjs';
import { useNotify } from '@/hooks/useNotify';

export function useInvoiceSubmission(
  form: UseFormReturn<FormValues>,
  customer: Customer | null,
  items: Item[],
  itemTaxes: Record<number, string>,
  router: AppRouterInstance,
  options?: { onDraftSaved?: () => void }
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyError, notifyPromise } = useNotify();

  const getNextReferenceCode = async () => {
    // Obtener la fecha actual en formato YYYYMMDD
    const fecha = dayjs().format('YYYYMMDD');
    // Lógica para obtener el siguiente número de factura del usuario (puedes ajustar según tu backend)
    // Aquí solo se simula con un número aleatorio para el ejemplo
    // Lo ideal sería pedir al backend el último número del día y sumarle 1
    const n = Math.floor(Math.random() * 1000) + 1;
    return `FA-${fecha}-${n}`;
  };

  // Función para crear y enviar la factura (flujo final)
  const handleSubmit = async (data: FormValues) => {
    if (!customer) {
      notifyError("Debe seleccionar un cliente para la factura");
      return;
    }

    if (items.length === 0) {
      notifyError("Debe agregar al menos un producto o servicio");
      return;
    }

    const missingTaxItems = items.filter((_, index) => !itemTaxes[index]);
    if (missingTaxItems.length > 0) {
      notifyError("Todos los productos deben tener un porcentaje de IVA asignado");
      return;
    }

    setIsSubmitting(true);

    try {
      const receiverId = customer.id;
      const itemsData = items.map((item, index) => {
        const total_Price = item.quantity * item.price;
        return {
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          tax_rate: itemTaxes[index] || "19",
          unit_measure_id: item.unit_measure || 70,
          standard_code_id: item.standard_code_id || 999,
          total_Price: total_Price,
          is_excluded: 0,
          tribute_id: parseInt(itemTaxes[index] || "19"),
          total_amount: total_Price
        };
      });

      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      // Generar reference_code automáticamente
      const reference_code = await getNextReferenceCode();
      const payload = {
        numbering_range_id: parseInt(data.numbering_range_id),
        reference_code,
        observation: data.observation || "",
        notes: data.observation || "",
        payment_method_code: parseInt(data.payment_method_code),
        receiverId,
        items: itemsData,
        totalAmount: totalAmount,
        total_amount: totalAmount,
      };

      const submissionPromise = api.post('/invoice/create', payload);

      await notifyPromise(
        submissionPromise,
        'Enviando factura...',
        'Factura creada y enviada con éxito.',
        'Error al crear la factura.'
      );

      router.push('/dashboard/history');
    } catch (error) {
      // El error ya es manejado por notifyPromise
      console.error("Error al crear factura:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para guardar como borrador
  const handleSaveDraft = async () => {
    if (!customer) {
      notifyError("Debe seleccionar un cliente para la factura");
      return;
    }

    if (items.length === 0) {
      notifyError("Debe agregar al menos un producto o servicio");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formValues = form.getValues();
      const receiverId = customer.id;
      const itemsData = items.map((item) => {
        const total_Price = item.quantity * item.price;
        return {
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          tax_rate: "0",
          total_Price: total_Price,
          is_excluded: 0,
          tribute_id: 0,
          total_amount: total_Price
        };
      });

      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const payload = {
        numbering_range_id: parseInt(formValues.numbering_range_id || "0"),
        reference_code: formValues.reference_code || "BORRADOR-" + new Date().getTime(),
        observation: (formValues.observation || "") ,
        notes: (formValues.observation || "") ,
        payment_method_code: parseInt(formValues.payment_method_code || "10"),
        status: "pending",
        receiverId,
        items: itemsData,
        totalAmount: totalAmount,
        total_amount: totalAmount,
        is_draft: true
      };

      const draftPromise = api.post('/invoice/create', payload);
      
      await notifyPromise(
        draftPromise,
        'Guardando borrador...',
        'Borrador guardado correctamente.',
        'Error al guardar el borrador.'
      );
      
      if (options?.onDraftSaved) options.onDraftSaved();
    } catch (error) {
      console.error("Error al guardar borrador:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
    handleSaveDraft
  };
}