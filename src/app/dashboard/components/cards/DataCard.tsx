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
        <h3 className="text-lg font-semibold">{item.code}</h3>
        <Badge className={cn(getStatusColor(item.status))}>
          {item.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{item.company}</p>
        <p className="text-xl font-medium">{formatCurrency(item.amount)}</p>
        <p className="text-xs text-muted-foreground">{item.date}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <IconEye className="cursor-pointer" onClick={() => onView(item)} size={16}/>
        <IconTrash className="cursor-pointer" onClick={() => onDelete(item)} size={16}/>
      </CardFooter>
    </Card>
  )
}
