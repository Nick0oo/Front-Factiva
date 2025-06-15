import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { IconSend } from '@tabler/icons-react';
import { Invoice } from '../models/invoice.model';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useState } from 'react';

interface InvoiceCardProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  // getClientNameById?: (id: string) => string; // Ya no se usa
}

export function InvoiceCard({ invoice, onView, onDownload }: InvoiceCardProps) {
  const [isValidating, setIsValidating] = useState(false);

  // Determinar color y texto del badge
  let badgeColor: 'default' | 'destructive' | 'outline' | 'secondary' = 'outline';
  let badgeText = invoice.status;
  if (["completed", "Pagada", "enviada", "Enviada"].includes(invoice.status)) {
    badgeColor = 'default';
    badgeText = 'Emitida';
  } else if (["pending", "Pendiente"].includes(invoice.status)) {
    badgeColor = 'secondary';
    badgeText = 'Pendiente';
  } else if (["cancelled", "anulada", "Anulada", "error", "Error"].includes(invoice.status)) {
    badgeColor = 'destructive';
    badgeText = 'Anulada';
  }

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

  // Nueva función para validar/enviar factura
  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const response = await api.post(`/factus/validate/${invoice._id}`);
      toast.success('Factura validada y enviada correctamente');
      // Opcional: podrías recargar la lista o actualizar el estado visualmente
    } catch (error: any) {
      console.error('Error al validar la factura:', error);
      toast.error('Error al validar la factura', {
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
          <CardTitle className="text-base">Factura #{invoice.reference_code}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{new Date(invoice.createdAt).toLocaleDateString()}</CardDescription>
        </div>
        <Badge variant={badgeColor}>{badgeText}</Badge>
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
        {/* Botón de validar solo si está pendiente */}
        {["pending", "Pendiente"].includes(invoice.status) && (
          <Button
            size="icon"
            variant="secondary"
            onClick={handleValidate}
            disabled={isValidating}
            aria-label="Enviar a la DIAN"
            title="Enviar a la DIAN"
            className="hover:bg-blue-600 hover:text-white transition-colors"
          >
            <IconSend size={20} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 