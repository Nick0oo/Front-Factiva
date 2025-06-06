'use client';
import { useState, useEffect } from 'react';
import { Invoice } from '../models/invoice.model';
import api from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload { sub: string }

const PAYMENT_METHODS: Record<string, string> = {
  '10': 'Efectivo',
  '20': 'Cheque',
  '30': 'Tarjeta de Crédito',
  '31': 'Tarjeta de Débito',
  '48': 'Transferencia',
  '49': 'Depósito',
  'ZZZ': 'Otro',
};

// Mock temporal
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'FAC-001',
    date: '2024-06-05',
    amount: 150000,
    status: 'Pagada',
    clientName: 'Juan Perez',
  },
  {
    id: '2',
    invoiceNumber: 'FAC-002',
    date: '2024-06-04',
    amount: 200000,
    status: 'Pendiente',
    clientName: 'Maria Gomez',
  },
];

export function useInvoicesHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No estás logueado');
        const { sub: userId } = jwtDecode<JWTPayload>(token);
        const res = await api.get(`/invoice/user/${userId}`);
        // Mapear la respuesta al modelo Invoice
        const mapped: Invoice[] = res.data.map((inv: any) => {
          // Buscar el nombre real del receptor igual que en el dashboard
          let receiverName =
            inv.receiverName ||
            inv.receiver?.name ||
            inv.receiver?.trade_name ||
            inv.receiver?.fullName ||
            inv.receiver?.razon_social ||
            inv.receiver?.nombre ||
            inv.receiver?.legal_name ||
            inv.receiver?.email ||
            'Cliente desconocido';
          // Mapear el método de pago a nombre legible
          const paymentMethod = PAYMENT_METHODS[inv.payment_method_code] || inv.payment_method_code || 'Desconocido';
          return {
            _id: inv._id,
            reference_code: inv.reference_code || inv.code || inv.invoiceNumber || inv.header || 'Sin número',
            createdAt: inv.createdAt,
            receiverName,
            totalAmount: inv.totalAmount,
            status: inv.status,
            payment_method_code: paymentMethod,
            observation: inv.observation,
            notes: inv.notes,
          };
        });
        // Ordenar por fecha descendente
        mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInvoices(mapped);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return { invoices, loading, error };
} 