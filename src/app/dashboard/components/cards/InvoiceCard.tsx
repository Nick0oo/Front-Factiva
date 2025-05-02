"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconEye, IconDownload } from "@tabler/icons-react"
import { InvoiceItem } from "@/components/data-table/mockData"

interface InvoiceCardProps {
  invoice: InvoiceItem
  onView: (invoice: InvoiceItem) => void
  onDownload: (invoice: InvoiceItem) => void
}

export function InvoiceCard({ invoice, onView, onDownload }: InvoiceCardProps) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{invoice.invoiceNumber}</CardTitle>
        <Badge variant="outline">{invoice.status}</Badge>
      </CardHeader>
      <CardDescription className="space-y-1">
        <p>{invoice.date}</p>
        <p>{invoice.amount}</p>
      </CardDescription>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onView(invoice)}>
          <IconEye size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDownload(invoice)}>
          <IconDownload size={16} />
        </Button>
      </CardFooter>
    </Card>
  )
}