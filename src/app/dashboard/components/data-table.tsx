"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { jwtDecode } from "jwt-decode"
import { z } from "zod"
import { DataCard } from "@/app/dashboard/components/cards/DataCard"
import { Button } from "@/components/ui/button"

// — actualizamos el schema:
export const schema = z.object({
  id: z.string(),
  code: z.string(),             // <-- nuevo
  status: z.union([
    z.literal("Done"),
    z.literal("In Progress"),
    z.literal("Cancelled")
  ]),
  amount: z.number(),
  company: z.string(),
  date: z.string()
})
type DataItem = z.infer<typeof schema>

// Factura “bruta” viene con receiverName opcional
interface InvoiceItem {
  _id: string;
  receiverName?: string;
  status: "pending" | "completed" | "error";
  totalAmount: number;
  createdAt: string;
}

interface JWTPayload { sub: string }

export function DataTable() {
  const router = useRouter()
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null)
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No estás logueado")
        const { sub: userId } = jwtDecode<JWTPayload>(token)

        const res = await api.get<InvoiceItem[]>(`/invoice/user/${userId}`)
        console.log("raw invoices:", res.data)
        const ult4 = res.data
          .sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 4)

        // mapeamos al shape de DataCard, generando code “FacN1”, “FacN2”…
        const mapped: DataItem[] = ult4.map((inv, idx) => {
          // si recibes un string → muéstralo; si recibes obj con name → úsalo
          const companyName = inv.receiverName || "Cliente desconocido"

          return {
            id: inv._id,
            code: `FacN${idx+1}`,
            status:
              inv.status === "completed" ? "Done" :
              inv.status === "pending"   ? "In Progress" :
                                          "Cancelled",
            amount: inv.totalAmount,
            company: companyName,
            date: inv.createdAt.split("T")[0]
          }
        })

        setData(mapped)
      } catch (err: any) {
        console.error(err)
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleView = (item: DataItem) => router.push(`/dashboard/invoices/${item.id}`)
  const handleDelete = async (item: DataItem) => {
    setLoading(true); setError(null)
    try {
      await api.delete(`/invoice/${item.id}`)
      setData(prev => prev.filter(d => d.id !== item.id))
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !data.length) return <p className="p-4 text-center">Cargando últimas facturas…</p>
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>
  if (!loading && !data.length) return <p className="p-4 text-center">No hay facturas recientes.</p>

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <Button onClick={() => router.push("/dashboard/invoices")} variant="outline">
            Ver todo
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map(item => (
            <DataCard
              key={item.id}
              item={item}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
