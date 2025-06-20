// models/client.types.ts
import { CustomerTributeId } from './enum/CustomerTributeId';
import { IdentityDocumentType } from './enum/IdentityDocumentType';

export interface Client {
  _id?: string;
  id?: string;
  identification: string;
  names: string;
  address: string;
  email: string;
  phone: string;
  legal_organization_id: number; // Siempre será 2 (Persona Natural)
  tribute_id: CustomerTributeId;
  identification_document_id: IdentityDocumentType;
  department: string;
  municipality_name: string;
  municipality_id?: number;
  isActive?: boolean;
}

export interface ClientFormValues {
  identification: string;
  names: string;
  address: string;
  email: string;
  phone: string;
  legal_organization_id: number; // Siempre será 2 (Persona Natural)
  tribute_id: CustomerTributeId;
  identification_document_id: IdentityDocumentType;
  department: string;
  municipality_name: string;
  municipality_id?: number;
}