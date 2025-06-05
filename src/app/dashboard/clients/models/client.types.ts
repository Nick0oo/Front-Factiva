// models/client.types.ts
import { CustomerTributeId } from './enum/CustomerTributeId';
import { IdentityDocumentType } from './enum/IdentityDocumentType';
import { OrganizationType } from './enum/OrganizationType';

export interface Client {
  _id?: string;
  id?: string;
  identification: string;
  dv?: number;
  company?: string;
  trade_name?: string;
  names: string;
  address: string;
  email: string;
  phone: string;
  legal_organization_id: OrganizationType;
  tribute_id: CustomerTributeId;
  identification_document_id: IdentityDocumentType;
  department: string;
  municipality_name: string;
  municipality_id?: number;
  partyType?: 'LEGAL' | 'NATURAL'; // Campo calculado para la UI
  isActive?: boolean;
}

export interface ClientFormValues {
  identification: string;
  dv?: number;
  company?: string;
  trade_name?: string;
  names: string;
  address: string;
  email: string;
  phone: string;
  legal_organization_id: OrganizationType;
  tribute_id: CustomerTributeId;
  identification_document_id: IdentityDocumentType;
  department: string;
  municipality_name: string;
  municipality_id?: number;
}