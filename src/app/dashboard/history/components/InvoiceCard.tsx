import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { IconSend } from '@tabler/icons-react';
import { Invoice } from '../models/invoice.model';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface InvoiceCardProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
   getClientNameById?: (id: string) => string; // Ya no se usa
}

export function InvoiceCard({ invoice, onView, onDownload }: InvoiceCardProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [localInvoice, setLocalInvoice] = useState(invoice);

  // Determinar color y texto del badge
  let badgeColor: 'default' | 'destructive' | 'outline' | 'secondary' = 'outline';
  let badgeText = localInvoice.status;
  if (["completed", "Pagada", "enviada", "Enviada"].includes(localInvoice.status)) {
    badgeColor = 'default';
    badgeText = 'Emitida';
  } else if (["pending", "Pendiente"].includes(localInvoice.status)) {
    badgeColor = 'secondary';
    badgeText = 'Pendiente';
  } else if (["cancelled", "anulada", "Anulada", "error", "Error"].includes(localInvoice.status)) {
    badgeColor = 'destructive';
    badgeText = 'Anulada';
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    const toastId = toast.loading("Descargando PDF...");
    try {
      const response = await api.get(`/factus/download-pdf-base64/${localInvoice._id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);

      toast.success('PDF descargado correctamente', { id: toastId });
    } catch (error: any) {
      console.error('Error en la descarga del PDF:', error);
      toast.error('Error al descargar el PDF', {
        id: toastId,
        description: error?.response?.data?.message || error.message || 'Error desconocido'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    const toastId = toast.loading("Validando con la DIAN...");
    try {
      // 1. Validate
      await api.post(`/factus/validate/${localInvoice._id}`);
      
      toast.loading('Factura validada. Descargando PDF...', { id: toastId });
      
      setLocalInvoice(prev => ({ ...prev, status: 'enviada' }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 2. Download
      const response = await api.get(`/factus/download-pdf-base64/${localInvoice._id}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);

      toast.success("Proceso completado con éxito.", { id: toastId });
      
    } catch (error: any) {
      console.error('Error en el proceso de validación:', error);
      toast.error('Error en el proceso', {
        id: toastId,
        description: error?.response?.data?.message || error.message || 'Error desconocido'
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="text-base">Factura #{localInvoice.reference_code}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{new Date(localInvoice.createdAt).toLocaleDateString()}</CardDescription>
        </div>
        <Badge variant={badgeColor}>{badgeText}</Badge>
      </CardHeader>
      <div className="px-6 pb-2">
        <p className="text-sm"><span className="font-medium">Cliente:</span> {localInvoice.receiverName}</p>
        <p className="text-sm"><span className="font-medium">Total:</span> ${localInvoice.totalAmount.toLocaleString()}</p>
        <p className="text-sm"><span className="font-medium">Método de pago:</span> {localInvoice.payment_method_code}</p>
        {localInvoice.observation && <p className="text-xs text-muted-foreground">Obs: {localInvoice.observation}</p>}
        {localInvoice.notes && <p className="text-xs text-muted-foreground">Notas: {localInvoice.notes}</p>}
      </div>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleDownload}
          disabled={isDownloading || isValidating}
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        </Button>
        {["pending", "Pendiente"].includes(localInvoice.status) && (
          <Button
            size="icon"
            variant="secondary"
            onClick={handleValidate}
            disabled={isValidating || isDownloading}
            aria-label="Enviar a la DIAN"
            title="Enviar a la DIAN"
            className="hover:bg-blue-600 hover:text-white transition-colors"
          >
            {isValidating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <IconSend size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 