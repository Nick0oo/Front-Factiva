import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { jwtDecode } from "jwt-decode"
import { IconFileText, IconClock, IconCurrencyEuro } from "@tabler/icons-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface JWTPayload { sub: string }

const SectionCards = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingCount: 0,
    totalAmount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No estás logueado")
        const { sub: userId } = jwtDecode<JWTPayload>(token)
        const [totalRes, pendingRes, amountRes] = await Promise.all([
          api.get(`/invoice/user/${userId}/count`),
          api.get(`/invoice/user/${userId}/status/pending/count`),
          api.get(`/invoice/user/${userId}/total`),
        ])
        setStats({
          totalInvoices: Array.isArray(totalRes.data) ? totalRes.data[0] : 0,
          pendingCount: Array.isArray(pendingRes.data) ? pendingRes.data[0] : 0,
          totalAmount: Array.isArray(amountRes.data) ? amountRes.data[0] : 0,
        })
      } catch (err: any) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <p className="p-4">Cargando métricas…</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  const progress = stats.totalInvoices > 0 ? Math.round((stats.pendingCount / stats.totalInvoices) * 100) : 0

  return (
    <section className="w-full mb-4">
      <h1 className="text-2xl font-bold mb-6">Resumen general</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <IconFileText size={32} className="text-primary" />
            <div>
              <CardDescription>Total de facturas</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.totalInvoices}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2 bg-muted" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <IconClock size={32} className="text-yellow-500" />
            <div>
              <CardDescription>Pendientes</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.pendingCount}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2 bg-yellow-500/30" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <IconCurrencyEuro size={32} className="text-green-500" />
            <div>
              <CardDescription>Monto total</CardDescription>
              <CardTitle className="text-3xl font-bold">{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(stats.totalAmount)}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2 bg-green-500/30" />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default SectionCards 