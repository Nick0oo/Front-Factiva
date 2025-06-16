'use client';
import { useInvoicesHistory } from './hooks/useInvoicesHistory';
import { InvoicesList } from './components/InvoicesList';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { InvoicesFilters } from './components/InvoicesFilters';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';
import type { Client } from '@/app/dashboard/clients/models/client.types';
import { useSidebar } from '@/components/ui/sidebar';

export default function HistoryPage() {
  const { invoices, loading, error } = useInvoicesHistory();
  const router = useRouter();
  const { open: isSidebarOpen } = useSidebar();

  // Estado para clientes
  const [clientes, setClientes] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { sub: userId } = jwtDecode<{ sub: string }>(token);
      const res = await api.get(`/invoice-parties/user/${userId}`);
      setClientes(res.data);
    };
    fetchClientes();
  }, []);

  // Función para obtener el nombre del cliente por id
  const getClientNameById = (id: string) => {
    const cliente = clientes.find(c => c._id === id || c.id === id);
    return cliente ? cliente.names : 'Cliente desconocido';
  };

  // Filtros de estado y cliente
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [clientFilter, setClientFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  // Obtener clientes únicos para el filtro
  const uniqueClients = useMemo(() => {
    const set = new Set(invoices.map(inv => inv.receiverName));
    return Array.from(set);
  }, [invoices]);

  // Filtrar facturas según filtros activos
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const statusOk = statusFilter ? inv.status === statusFilter : true;
      const clientOk = clientFilter ? inv.receiverName === clientFilter : true;
      const dateOk = (
        (!dateFrom || new Date(inv.createdAt) >= new Date(dateFrom)) &&
        (!dateTo || new Date(inv.createdAt) <= new Date(dateTo))
      );
      const minOk = minAmount ? inv.totalAmount >= Number(minAmount) : true;
      const maxOk = maxAmount ? inv.totalAmount <= Number(maxAmount) : true;
      return statusOk && clientOk && dateOk && minOk && maxOk;
    });
  }, [invoices, statusFilter, clientFilter, dateFrom, dateTo, minAmount, maxAmount]);

  const handleView = (invoice: any) => {
    // Aquí puedes abrir un modal o navegar a detalles
    alert(`Ver factura: ${invoice.reference_code}`);
  };

  const handleDownload = (invoice: any) => {
    // Aquí puedes implementar la descarga de PDF/XML
    alert(`Descargar factura: ${invoice.reference_code}`);
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Historial de Facturas</h1>
        <Button
          onClick={() => router.push('/dashboard/newfactura')}
          aria-label="Crear nueva factura"
          tabIndex={0}
          className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-full shadow-lg px-6 py-2 flex items-center gap-2 hover:scale-105 hover:from-blue-500 hover:to-primary transition-all duration-200"
        >
          <PlusCircle className="size-5" />
          Crear Factura
        </Button>
      </div>
      <InvoicesFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        clientFilter={clientFilter}
        setClientFilter={setClientFilter}
        uniqueClients={uniqueClients}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        minAmount={minAmount}
        setMinAmount={setMinAmount}
        maxAmount={maxAmount}
        setMaxAmount={setMaxAmount}
      />
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <InvoicesList
        invoices={filteredInvoices}
        onView={handleView}
        onDownload={handleDownload}
        getClientNameById={getClientNameById}
      />    
    </div>
  );
} 