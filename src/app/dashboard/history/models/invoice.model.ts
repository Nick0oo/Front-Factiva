export interface Invoice {
  _id: string;
  reference_code: string;
  createdAt: string;
  receiverName: string;
  totalAmount: number;
  status: string;
  payment_method_code: string;
  observation?: string;
  notes?: string;
} 