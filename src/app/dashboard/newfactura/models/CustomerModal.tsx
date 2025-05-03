import React, { useState } from 'react'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Building, User } from 'lucide-react'

export interface Customer {
  id: string
  document: string
  names: string
  email: string
  phone?: string
  address?: string
  company?: string
}

interface CustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (customer: Customer) => void
}

// Datos de ejemplo - en producción vendrían de una API
const SAMPLE_CUSTOMERS: Customer[] = [
  { id: '1', document: '20539853111', names: 'ACME S.A.', email: 'contacto@acme.com', phone: '987654321', address: 'Av. Principal 123', company: 'ACME' },
  { id: '2', document: '10456789012', names: 'Juan Pérez', email: 'juan@gmail.com', phone: '987123456', address: 'Jr. Lima 234' },
  { id: '3', document: '20567890123', names: 'Inversiones XYZ', email: 'info@xyz.com', phone: '912345678', address: 'Calle Comercio 567', company: 'XYZ' },
  { id: '4', document: '10789012345', names: 'María López', email: 'maria@outlook.com', phone: '945678912', address: 'Av. Central 890' },
  { id: '5', document: '20890123456', names: 'Tecnología ABC', email: 'ventas@abc.com', phone: '956789012', address: 'Jr. Industria 456', company: 'ABC' },
  { id: '6', document: '10901234567', names: 'Carlos Rodríguez', email: 'carlos@hotmail.com', phone: '934567890', address: 'Calle Nueva 789' },
];

export function CustomerModal({ open, onOpenChange, onSelect }: CustomerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar clientes según término de búsqueda
  const filteredCustomers = SAMPLE_CUSTOMERS.filter(customer => 
    customer.names.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.document.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Seleccionar Cliente</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Buscador */}
          <div className="flex items-center border rounded-md pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre, documento o email" 
              className="border-0 focus-visible:ring-0"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Lista de clientes */}
          <ScrollArea className="h-[300px] rounded-md border p-2">
            {filteredCustomers.length > 0 ? (
              <div className="space-y-2">
                {filteredCustomers.map(customer => (
                  <div 
                    key={customer.id} 
                    className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-md cursor-pointer"
                    onClick={() => {
                      onSelect(customer);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex gap-3">
                      {customer.company ? (
                        <Building className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="font-medium">{customer.names}</div>
                        <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:gap-2">
                          <span>{customer.document}</span>
                          {customer.email && (
                            <span className="hidden sm:inline text-muted-foreground">•</span>
                          )}
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Seleccionar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No se encontraron clientes con ese término
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}