// hooks/useClientSubmission.tsx
import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import api from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';
import { type ClientFormValues } from './useClientForm';
import { type ClientData } from './useClientData';
import { type Client } from '../models/client.types';
import { useNotify } from '@/hooks/useNotify';

// Tipo para el payload del JWT
interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export function useClientSubmission(
  form: UseFormReturn<ClientFormValues>,
  clientData: ClientData,
  onSuccess?: (client: Client) => void,
  onClose?: () => void
) {
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const handleSubmit = async (formData: ClientFormValues) => {
    
    
    setIsSubmitting(true);
    
    try {
      // Obtener el token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.sub;

      // Combinar datos del formulario con clientData (como en newfactura)
      const finalData = {
        ...formData,     // ← Primero los datos del formulario (con enums como strings)
        ...clientData,   // ← Después clientData (pero formData ya tiene esos campos!)
        legal_organization_id: Number(clientData.legal_organization_id),
        tribute_id: Number(clientData.tribute_id),
        identification_document_id: Number(clientData.identification_document_id),
        user_id: userId,
      };
      console.log('Payload enviado:', finalData);

      const response = await api.post('/invoice-parties/receiver', finalData);
      
      

      notifySuccess('Cliente creado con éxito');
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      if (onClose) {
        onClose();
      }
      form.reset();
    } catch (error: any) {
      console.error('Error:', error);
      notifyError(error.response?.data?.message || 'Error al crear el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  console.log("🔧 handleSubmit creado:", typeof handleSubmit); // ← Agregar

  return { isSubmitting, handleSubmit };
}