"use client"

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  IconEye,
  IconTrash,
  IconEdit2,
  IconCheck,
  IconClock,
  IconCircle,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import type { z } from "zod"
import type { schema } from "@/app/dashboard/components/data-table"

type DataItem = z.infer<typeof schema>

interface DataCardProps {
  item: DataItem
  onView: (item: DataItem) => void
  onEdit?: (item: DataItem) => void
  onDelete: (item: DataItem) => void
}

export function DataCard({ item, onView, onEdit, onDelete }: DataCardProps) {
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "done": return "bg-green-100 text-green-800"
      case "in progress":
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const statusIcon =
    item.status === "Done" ? <IconCheck size={12}/> :
    item.status === "In Progress" ? <IconClock size={12}/> :
    <IconCircle size={12}/>

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n)

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <span className="text-gray-300 font-medium text-sm">{item.id}</span>
        <Badge
          variant="outline"
          className={cn("text-sm font-medium border-none", getStatusColor(item.status))}
        >
          <span className="flex items-center gap-1">
            {statusIcon} {item.status}
          </span>
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <h3 className="text-white text-2xl font-bold">
          {item.amount ? formatCurrency(item.amount) : "$0"}
        </h3>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>{item.company || "Sin empresa"}</span>
          <span>{item.date || new Date().toISOString().split("T")[0]}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => onView(item)}
        >
          <IconEye size={16}/>
        </button>
        {onEdit && (
          <button
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => onEdit(item)}
          >
            <IconEdit2 size={16}/>
          </button>
        )}
        <button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => onDelete(item)}
        >
          <IconTrash size={16}/>
        </button>
      </CardFooter>
    </Card>
  )
}
