export interface Product {
  _id?: string;
  code_reference: string;
  name: string;
  price: number;
  unit_measure: string | number;
  tribute_id: string | number;
  standard_code_id: string | number;
  createdAt?: string;
  updatedAt?: string;
  // Puedes agregar más campos si el backend los retorna
} 