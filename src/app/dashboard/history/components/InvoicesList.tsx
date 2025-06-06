import { Invoice } from '../models/invoice.model';
import { InvoiceCard } from './InvoiceCard';

interface InvoicesListProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  getClientNameById: (id: string) => string;
}

export function InvoicesList({ invoices, onView, onDownload, getClientNameById }: InvoicesListProps) {
  if (invoices.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No hay facturas registradas.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice._id}
          invoice={invoice}
          onView={onView}
          onDownload={onDownload}
          getClientNameById={getClientNameById}
        />
      ))}
    </div>
  );
} 