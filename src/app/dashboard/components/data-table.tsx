"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { mockData } from "@/app/dashboard/components/data-table/mockData"
import { DataCard } from "@/app/dashboard/components/cards/DataCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react"

// Tipo inferido de DataItem a partir de mockData
type DataItem = typeof mockData[number]

export function DataTable() {
  const router = useRouter()

  // Inicializar datos simulados o array vacío para evitar errores
  const [data, setData] = React.useState<DataItem[]>(() => Array.isArray(mockData) ? mockData : [])

  // React.useEffect(() => {
  //   fetch('/api/data')
  //     .then(res => res.json())
  //     .then(json => setData(json))
  // }, [])

  const [search, setSearch] = React.useState("")
  const [pageSize, setPageSize] = React.useState(4)
  const [page, setPage] = React.useState(1)

  // Filtrado
  const handleViewAll = () => {
    // Simular redirección
    console.log("Redirecting to view all...");
  }

  // Handlers
  const handleView = (item: DataItem) => {
    // Simular acción de ver detalles
    console.log('View', item)
  }
  const handleDelete = (item: DataItem) => {
    // Simular borrado con API comentado
    // fetch(`/api/delete/${item.id}`, { method: 'DELETE' })
    setData(prev => prev.filter(d => d.id !== item.id))
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-6">

        {/* Botón Ver Todo */}
        <div className="flex justify-end">
          <Button onClick={() => router.push("/ruta-destino")} variant="outline">
            Ver todo
          </Button>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map(item => (
            <DataCard
              key={item.id}
              item={item}
              onView={() => console.log("View", item)}
              onDelete={() => {/*…*/}}
            />
          ))}
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setPage(1)} disabled={page === 1}>
            <IconChevronsLeft />
          </Button>
          <Button size="icon" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <IconChevronLeft />
          </Button>
          <span className="px-2">Page {page} of {Math.ceil(data.length / pageSize)}</span>
          <Button size="icon" variant="outline" onClick={() => setPage(p => Math.min(Math.ceil(data.length / pageSize), p + 1))} disabled={page === Math.ceil(data.length / pageSize)}>
            <IconChevronRight />
          </Button>
          <Button size="icon" variant="outline" onClick={() => setPage(Math.ceil(data.length / pageSize))} disabled={page === Math.ceil(data.length / pageSize)}>
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
