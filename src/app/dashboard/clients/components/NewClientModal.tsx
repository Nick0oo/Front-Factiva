import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useClientForm } from '../hooks/useClientForm';
import { useClientData } from '../hooks/useClientData';
import { type Client } from '../models/client.types';
import api from '@/lib/axios';

// Importar componentes refactorizados
import { ClientTypeSelector } from '../form-sections/ClientTypeSelector';
import { IdentificationSection } from '../form-sections/IdentificationSection';
import { NameSection } from '../form-sections/NameSection';
import { ContactInfoSection } from '../form-sections/ContactInfoSection';
import { LocationSection } from '../form-sections/LocationSection';
import { TaxInfoSection } from '../form-sections/TaxInfoSection';

interface NewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Client;
  isEdit?: boolean;
  onClientSaved?: () => void;
}

export function NewClientModal({ open, onOpenChange, initialData, isEdit, onClientSaved }: NewClientModalProps) {
  const { form } = useClientForm();
  const {
    clientData,
    updateOrganizationType,
    updateDocumentType,
    updateTaxType,
    resetClientData
  } = useClientData();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset();
      }
      resetClientData();
      setError(null);
    }
  }, [open, initialData, form, resetClientData]);

  const isCompany = clientData.legal_organization_id === 1;

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (isEdit && initialData) {
        // Actualizar cliente
        await api.patch(`/invoice-parties/${initialData._id || initialData.id}`, data);
      } else {
        // Crear cliente
        await api.post('/invoice-parties', data);
      }
      if (onClientSaved) onClientSaved();
    } catch (err: any) {
      setError('Error al guardar el cliente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{isEdit ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</DialogTitle>
          <DialogClose />
        </DialogHeader>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            
            {/* Selectores independientes */}
            <ClientTypeSelector 
              clientData={clientData} 
              updateOrganizationType={updateOrganizationType} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IdentificationSection 
                clientData={clientData}
                updateDocumentType={updateDocumentType}
                isCompany={isCompany}
                form={form}
              />
              
              <NameSection form={form} isCompany={isCompany} />
              
              <TaxInfoSection 
                clientData={clientData}
                updateTaxType={updateTaxType}
              />
            </div>
            
            <ContactInfoSection form={form} />
            <LocationSection form={form} />
            
            {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  resetClientData();
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : isEdit ? 'Guardar Cambios' : 'Guardar Cliente'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}