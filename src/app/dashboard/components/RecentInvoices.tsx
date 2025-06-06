import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { jwtDecode } from "jwt-decode"
import { IconEye, IconDownload, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface JWTPayload { sub: string }

const PAYMENT_METHODS: Record<string, string> = {
  '10': 'Efectivo',
  '20': 'Cheque',
  '30': 'Tarjeta de Crédito',
  '31': 'Tarjeta de Débito',
  '48': 'Transferencia',
  '49': 'Depósito',
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

  if (loading) return <p className="p-4">Cargando facturas…</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>
  if (!invoices.length) return <p className="p-4">No hay facturas recientes.</p>

  const inv = invoices[current]
  const statusColor =
    inv.status === 'Pagada' || inv.status === 'completed' ? 'success' :
    inv.status === 'Pendiente' || inv.status === 'pending' ? 'warning' :
    'destructive'

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
              {inv.status}
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
              <Button size="icon" variant="outline" aria-label="Ver factura"><IconEye size={20} /></Button>
              <Button size="icon" variant="outline" aria-label="Descargar factura"><IconDownload size={20} /></Button>
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