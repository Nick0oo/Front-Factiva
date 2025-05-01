"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { jwtDecode } from "jwt-decode"
import { StatCard } from "@/app/dashboard/components/cards/StatCard"

interface JWTPayload { sub: string }

export function SectionCards() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidCount:     0,
    pendingCount:  0,
    errorCount:    0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string>()

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No estás logueado")
        const { sub: userId } = jwtDecode<JWTPayload>(token)

        const [
          totalRes,
          completedRes,
          pendingRes,
          errorRes
        ] = await Promise.all([
          api.get<number>(`/invoice/user/${userId}/count`),
          api.get<number>(`/invoice/user/${userId}/status/completed/count`),
          api.get<number>(`/invoice/user/${userId}/status/pending/count`),
          api.get<number>(`/invoice/user/${userId}/status/error/count`)
        ])

        setStats({
          totalInvoices: totalRes.data,
          paidCount:     completedRes.data,
          pendingCount:  pendingRes.data,
          errorCount:    errorRes.data
        })
      } catch (err: any) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <p>Cargando estadísticas…</p>
  if (error)   return <p className="text-red-500">{error}</p>

  const configs = [
    {
      title:          "Total de facturas",
      value:          stats.totalInvoices,
      change:         0,
      trend:          "up",
      footerTitle:    "Facturas emitidas",
      footerSubtitle: "Total de registros"
    },
    {
      title:          "Facturas completadas",
      value:          stats.paidCount,
      change:         0,
      trend:          "up",
      footerTitle:    "Estado completado",
      footerSubtitle: "Clientes cumplidos"
    },
    {
      title:          "Facturas pendientes",
      value:          stats.pendingCount,
      change:         0,
      trend:          "down",
      footerTitle:    "Requiere seguimiento",
      footerSubtitle: "Acciones pendientes"
    },
    {
      title:          "Facturas con error",
      value:          stats.errorCount,
      change:         0,
      trend:          "down",
      footerTitle:    "Estado error",
      footerSubtitle: "Revisión necesaria"
    }
  ]

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
        {configs.map((c, i) => (
          <StatCard key={i} {...c} />
        ))}
      </div>
    </section>
  )
}
