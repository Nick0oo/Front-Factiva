import { useState, useCallback } from 'react';

export interface ClientData {
  legal_organization_id: number;
  identification_document_id: number;
  tribute_id: number;
}

export function useClientData() {
  const [clientData, setClientData] = useState<ClientData>({
    legal_organization_id: 2, // Persona Natural por defecto
    identification_document_id: 3, // Cédula por defecto
    tribute_id: 21, // No aplica por defecto
  });

  const updateOrganizationType = useCallback((type: number) => {
    setClientData(prev => ({ ...prev, legal_organization_id: type }));
  }, []);

  const updateDocumentType = useCallback((type: number) => {
    setClientData(prev => ({ ...prev, identification_document_id: type }));
  }, []);

  const updateTaxType = useCallback((type: number) => {
    setClientData(prev => ({ ...prev, tribute_id: type }));
  }, []);

  const resetClientData = useCallback(() => {
    setClientData({
      legal_organization_id: 2,
      identification_document_id: 3,
      tribute_id: 21,
    });
  }, []);

  return {
    clientData,
    updateOrganizationType,
    updateDocumentType,
    updateTaxType,
    resetClientData,
  };
}