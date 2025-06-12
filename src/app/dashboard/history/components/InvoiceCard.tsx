import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { Invoice } from '../models/invoice.model';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface InvoiceCardProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  // getClientNameById?: (id: string) => string; // Ya no se usa
}

export function InvoiceCard({ invoice, onView, onDownload }: InvoiceCardProps) {
  const handleDownload = async () => {
    try {
      // Hacer la petición con el token de autorización
      const response = await api.get(`/factus/download-pdf-base64/${invoice._id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Crear URL del blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Solo abrir en nueva pestaña
      window.open(url, '_blank');

      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      toast.error('Error al descargar el PDF', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="text-base">Factura #{invoice.reference_code}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{new Date(invoice.createdAt).toLocaleDateString()}</CardDescription>
        </div>
        <Badge variant={invoice.status === 'Enviada' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'outline'}>{invoice.status}</Badge>
      </CardHeader>
      <div className="px-6 pb-2">
        <p className="text-sm"><span className="font-medium">Cliente:</span> {invoice.receiverName}</p>
        <p className="text-sm"><span className="font-medium">Total:</span> ${invoice.totalAmount.toLocaleString()}</p>
        <p className="text-sm"><span className="font-medium">Método de pago:</span> {invoice.payment_method_code}</p>
        {invoice.observation && <p className="text-xs text-muted-foreground">Obs: {invoice.observation}</p>}
        {invoice.notes && <p className="text-xs text-muted-foreground">Notas: {invoice.notes}</p>}
      </div>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="icon" onClick={handleDownload}>
          <Download className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
} 