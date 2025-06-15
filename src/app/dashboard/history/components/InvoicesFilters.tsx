import React from 'react';
import { Eraser } from 'lucide-react';

interface InvoicesFiltersProps {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  clientFilter: string;
  setClientFilter: (v: string) => void;
  uniqueClients: string[];
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  minAmount: string;
  setMinAmount: (v: string) => void;
  maxAmount: string;
  setMaxAmount: (v: string) => void;
}

export const InvoicesFilters: React.FC<InvoicesFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  clientFilter,
  setClientFilter,
  uniqueClients,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
}) => {
  const handleClear = () => {
    setStatusFilter('');
    setClientFilter('');
    setDateFrom('');
    setDateTo('');
    setMinAmount('');
    setMaxAmount('');
  };

  return (
    <div className="backdrop-blur bg-black/40 rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row md:items-end gap-6 md:gap-8 border border-white/10">
      <div className="flex flex-col min-w-[140px]">
        <label htmlFor="status-filter" className="text-xs font-semibold mb-1 text-muted-foreground">Estado</label>
        <select
          id="status-filter"
          className="rounded-xl border-none bg-zinc-900/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm text-white placeholder:text-muted-foreground shadow-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos</option>
          <option value="completado">Emitida</option>
          <option value="pending">Pendiente</option>
          <option value="cancelled">Anulada</option>
        </select>
      </div>
      <div className="flex flex-col min-w-[140px]">
        <label htmlFor="client-filter" className="text-xs font-semibold mb-1 text-muted-foreground">Cliente</label>
        <select
          id="client-filter"
          className="rounded-xl border-none bg-zinc-900/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm text-white placeholder:text-muted-foreground shadow-sm"
          value={clientFilter}
          onChange={e => setClientFilter(e.target.value)}
          aria-label="Filtrar por cliente"
        >
          <option value="">Todos</option>
          {uniqueClients.map(client => (
            <option key={client} value={client}>{client}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col min-w-[140px]">
        <label htmlFor="date-from" className="text-xs font-semibold mb-1 text-muted-foreground">Fecha desde</label>
        <input
          id="date-from"
          type="date"
          className="rounded-xl border-none bg-zinc-900/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm text-white placeholder:text-muted-foreground shadow-sm"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          aria-label="Filtrar desde fecha"
        />
      </div>
      <div className="flex flex-col min-w-[140px]">
        <label htmlFor="date-to" className="text-xs font-semibold mb-1 text-muted-foreground">Fecha hasta</label>
        <input
          id="date-to"
          type="date"
          className="rounded-xl border-none bg-zinc-900/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm text-white placeholder:text-muted-foreground shadow-sm"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          aria-label="Filtrar hasta fecha"
        />
      </div>
      <div className="flex flex-col min-w-[120px]">
        <label htmlFor="min-amount" className="text-xs font-semibold mb-1 text-muted-foreground">Monto mínimo</label>
        <input
          id="min-amount"
          type="number"
          min="0"
          className="rounded-xl border-none bg-zinc-900/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm text-white placeholder:text-muted-foreground shadow-sm"
          value={minAmount}
          onChange={e => setMinAmount(e.target.value)}
          placeholder="0"
          aria-label="Monto mínimo"
        />
      </div>
      <div className="flex flex-col min-w-[120px]">
        <label htmlFor="max-amount" className="text-xs font-semibold mb-1 text-muted-foreground">Monto máximo</label>
        <input
          id="max-amount"
          type="number"
          min="0"
          className="rounded-xl border-none bg-zinc-900/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm text-white placeholder:text-muted-foreground shadow-sm"
          value={maxAmount}
          onChange={e => setMaxAmount(e.target.value)}
          placeholder="999999"
          aria-label="Monto máximo"
        />
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/80 text-muted-foreground hover:bg-primary/80 hover:text-white transition-colors shadow-sm mt-2 md:mt-0"
        aria-label="Limpiar filtros"
        tabIndex={0}
      >
        <Eraser className="size-4" />
        Limpiar
      </button>
    </div>
  );
}; 