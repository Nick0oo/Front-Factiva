import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { type FormValues } from './useInvoiceForm';
import { type Customer } from '../models/CustomerModal';
import { type Item } from '../models/ItemsModal';
import api from '@/lib/axios';

export function useInvoiceSubmission(
  form: UseFormReturn<FormValues>,
  customer: Customer | null,
  items: Item[],
  itemTaxes: Record<number, string>,
  router: AppRouterInstance
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para crear y enviar la factura
  const handleSubmit = async (data: FormValues) => {
    if (!customer) {
      alert("Error: Debe seleccionar un cliente para la factura");
      return;
    }

    if (items.length === 0) {
      alert("Error: Debe agregar al menos un producto o servicio");
      return;
    }

    const missingTaxItems = items.filter((_, index) => !itemTaxes[index]);
    if (missingTaxItems.length > 0) {
      alert("Error: Todos los productos deben tener un porcentaje de IVA asignado");
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
      const payload = {
        numbering_range_id: parseInt(data.numbering_range_id),
        reference_code: data.reference_code,
        observation: data.observation || "",
        payment_method_code: parseInt(data.payment_method_code),
        receiverId,
        items: itemsData,
        totalAmount: totalAmount,
        total_amount: totalAmount,
      };

      console.log("Enviando factura:", payload);
      const response = await api.post('/invoice/create', payload);
      alert("Éxito: La factura se ha creado correctamente");
      router.push('/dashboard/invoices');
    } catch (error: any) {
      console.error("Error al crear factura:", error);
      alert(`Error: ${error.response?.data?.message || "Error al crear la factura"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para guardar como borrador
  const handleSaveDraft = async () => {
    if (!customer) {
      alert("Error: Debe seleccionar un cliente para la factura");
      return;
    }

    if (items.length === 0) {
      alert("Error: Debe agregar al menos un producto o servicio");
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
        observation: (formValues.observation || "") + " [BORRADOR]",
        payment_method_code: parseInt(formValues.payment_method_code || "10"),
        status: "pending",
        receiverId,
        items: itemsData,
        totalAmount: totalAmount,
        total_amount: totalAmount,
        is_draft: true
      };

      console.log("Enviando borrador:", payload);
      const response = await api.post('/invoice/create', payload);
      console.log("¡Borrador guardado con éxito!", response.data);
      alert("El borrador se ha guardado correctamente");
    } catch (error: any) {
      console.error("Error al guardar borrador:", error);
      alert(`Error: ${error.response?.data?.message || "Error al guardar el borrador"}`);
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