import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { jwtDecode } from "jwt-decode"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface JWTPayload { sub: string }

const QuickSummaryAndTips = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    error: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No estás logueado")
        const { sub: userId } = jwtDecode<JWTPayload>(token)
        const [totalRes, pendingRes, completedRes, errorRes] = await Promise.all([
          api.get(`/invoice/user/${userId}/count`),
          api.get(`/invoice/user/${userId}/status/pending/count`),
          api.get(`/invoice/user/${userId}/status/completed/count`),
          api.get(`/invoice/user/${userId}/status/error/count`),
        ])
        setStats({
          total: Array.isArray(totalRes.data) ? totalRes.data[0] : 0,
          pending: Array.isArray(pendingRes.data) ? pendingRes.data[0] : 0,
          completed: Array.isArray(completedRes.data) ? completedRes.data[0] : 0,
          error: Array.isArray(errorRes.data) ? errorRes.data[0] : 0,
        })
      } catch (err: any) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const progress = stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0

  return (
    <section className="w-full flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Resumen rápido</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm">Cargando resumen…</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <ul className="text-base space-y-1 mb-4">
              <li>Total de facturas: <span className="font-bold">{stats.total}</span></li>
              <li className="text-yellow-600">Pendientes: <span className="font-bold">{stats.pending}</span></li>
              <li className="text-green-600">Completadas: <span className="font-bold">{stats.completed}</span></li>
              <li className="text-red-600">Con error: <span className="font-bold">{stats.error}</span></li>
            </ul>
          )}
          <div className="mb-2">Progreso</div>
          <Progress value={progress} className="h-2 bg-muted" indicatorClassName="bg-yellow-500" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Tips útiles</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-base space-y-1 text-muted-foreground">
            <li>Revisa tus facturas pendientes regularmente.</li>
            <li>Recuerda exportar tus datos para respaldo.</li>
            <li>Contacta soporte si ves facturas con error.</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}

export default QuickSummaryAndTips 