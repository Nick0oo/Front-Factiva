import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { jwtDecode } from "jwt-decode"
import { IconEye, IconDownload, IconChevronLeft, IconChevronRight, IconSend } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

interface JWTPayload { sub: string }

const PAYMENT_METHODS: Record<string, string> = {
  '1': 'Medio no definido',
  '10': 'Efectivo',
  '20': 'Cheque',
  '42': 'Consignación',
  '47': 'Transferencia',
  '48': 'Tarjeta de Crédito',
  '49': 'Tarjeta de Débito',
  '71': 'Bonos',
  '72': 'Vales',
  'ZZZ': 'Otro',
}

type Invoice = {
  _id: string;
  reference_code: string;
  createdAt: string;
  receiverName: string;
  totalAmount: number;
  status: string;
  payment_method_code: string;
}

const RecentInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [isValidating, setIsValidating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No estás logueado')
        const { sub: userId } = jwtDecode<JWTPayload>(token)
        const res = await api.get(`/invoice/user/${userId}?page=1&limit=3`)
        const mapped: Invoice[] = res.data.map((inv: any) => {
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
          const paymentMethod = PAYMENT_METHODS[inv.payment_method_code] || inv.payment_method_code || 'Desconocido';
          return {
            _id: inv._id,
            reference_code: inv.reference_code || inv.code || inv.invoiceNumber || inv.header || 'Sin número',
            createdAt: inv.createdAt,
            receiverName,
            totalAmount: inv.totalAmount,
            status: inv.status,
            payment_method_code: paymentMethod,
          }
        })
        setInvoices(mapped)
      } catch (err: any) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? invoices.length - 1 : prev - 1))
  const handleNext = () => setCurrent((prev) => (prev === invoices.length - 1 ? 0 : prev + 1))
  const handleViewAll = () => router.push('/dashboard/history')

  const handleDownload = async (invoice: any) => {
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
      
      // Abrir en nueva pestaña
      window.open(url, '_blank');


      // Limpiar URL del blob
      window.URL.revokeObjectURL(url);

      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      toast.error('Error al descargar el PDF', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  const handleValidate = async (invoice: Invoice) => {
    setIsValidating(true);
    try {
      await api.post(`/factus/validate/${invoice._id}`);
      toast.success('Factura enviada y validada correctamente');
      // Opcional: podrías recargar la lista o actualizar el estado visualmente
    } catch (error: any) {
      console.error('Error al enviar la factura:', error);
      toast.error('Error al enviar la factura', {
        description: error?.response?.data?.message || error.message || 'Error desconocido'
      });
    } finally {
      setIsValidating(false);
    }
  };

  if (loading) return <p className="p-4">Cargando facturas…</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>
  if (!invoices.length) return <p className="p-4">No hay facturas recientes.</p>

  const inv = invoices[current]
  let statusColor: 'default' | 'destructive' | 'outline' | 'secondary' = 'outline';
  let badgeText = inv.status;
  if (["Pagada", "completed", "enviada", "Enviada"].includes(inv.status)) {
    statusColor = 'default';
    badgeText = 'Emitida';
  } else if (["pending", "Pendiente"].includes(inv.status)) {
    statusColor = 'secondary';
    badgeText = 'Pendiente';
  } else if (["cancelled", "anulada", "Anulada", "error", "Error"].includes(inv.status)) {
    statusColor = 'destructive';
    badgeText = 'Anulada';
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Facturas recientes</h2>
        <Button onClick={handleViewAll} variant="secondary" className="font-semibold">Ver todas</Button>
      </div>
      <div className="relative flex items-center justify-center">
        {/* Flecha izquierda */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full"
          aria-label="Anterior"
          tabIndex={0}
          onClick={handlePrev}
        >
          <IconChevronLeft size={22} />
        </Button>
        {/* Tarjeta */}
        <Card className="flex-1 max-w-xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Factura #{inv.reference_code}</CardTitle>
              <CardDescription>{new Date(inv.createdAt).toLocaleDateString()}</CardDescription>
            </div>
            <Badge variant={statusColor} className="capitalize text-base px-3 py-1 rounded-full">
              {badgeText}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-2">
            <div className="text-muted-foreground text-base">Cliente:</div>
            <div className="font-semibold text-lg mb-1">{inv.receiverName}</div>
            <div className="text-muted-foreground text-base">Total:</div>
            <div className="font-bold text-2xl mb-1">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(inv.totalAmount)}</div>
            <div className="text-muted-foreground text-base">Método de pago:</div>
            <div className="font-medium text-lg mb-2">{inv.payment_method_code}</div>
            <div className="flex gap-3 mt-2">
              <Button size="icon" variant="outline" aria-label="Descargar factura" onClick={() => handleDownload(inv)}><IconDownload size={20} /></Button>
              {/* Botón de enviar solo si está pendiente */}
              {['pending', 'Pendiente'].includes(inv.status) && (
                <Button
                  size="icon"
                  variant="secondary"
                  aria-label="Enviar a la DIAN"
                  title="Enviar a la DIAN"
                  onClick={() => handleValidate(inv)}
                  disabled={isValidating}
                  className="hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <IconSend size={20} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Flecha derecha */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full"
          aria-label="Siguiente"
          tabIndex={0}
          onClick={handleNext}
        >
          <IconChevronRight size={22} />
        </Button>
      </div>
      {/* Dots de paginación */}
      <div className="flex justify-center mt-4 gap-2">
        {invoices.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              idx === current
                ? 'bg-primary'
                : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default RecentInvoices 