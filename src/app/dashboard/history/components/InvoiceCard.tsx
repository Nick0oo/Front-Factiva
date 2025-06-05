import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { Invoice } from '../models/invoice.model';

interface InvoiceCardProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
}

export function InvoiceCard({ invoice, onView, onDownload }: InvoiceCardProps) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="text-base">Factura #{invoice.reference_code}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{new Date(invoice.createdAt).toLocaleDateString()}</CardDescription>
        </div>
        <Badge variant={invoice.status === 'completed' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'outline'}>{invoice.status}</Badge>
      </CardHeader>
      <div className="px-6 pb-2">
        <p className="text-sm"><span className="font-medium">Cliente:</span> {invoice.receiverName}</p>
        <p className="text-sm"><span className="font-medium">Total:</span> ${invoice.totalAmount.toLocaleString()}</p>
        <p className="text-sm"><span className="font-medium">Método de pago:</span> {invoice.payment_method_code}</p>
        {invoice.observation && <p className="text-xs text-muted-foreground">Obs: {invoice.observation}</p>}
        {invoice.notes && <p className="text-xs text-muted-foreground">Notas: {invoice.notes}</p>}
      </div>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onView(invoice)}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDownload(invoice)}>
          <Download className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
} 