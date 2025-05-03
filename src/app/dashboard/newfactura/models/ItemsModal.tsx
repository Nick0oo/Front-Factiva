import React, { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'

export interface Item {
  code_reference: string
  name: string
  quantity: number
  price: number
}

interface ItemsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (item: Item) => void
}

// Datos de ejemplo - en producción vendrían de una API
const SAMPLE_ITEMS: Item[] = [
  { code_reference: 'P001', name: 'Laptop Dell XPS 15', quantity: 1, price: 1299.99 },
  { code_reference: 'P002', name: 'Monitor LG 27"', quantity: 1, price: 249.99 },
  { code_reference: 'P003', name: 'Teclado Logitech MX Keys', quantity: 1, price: 119.99 },
  { code_reference: 'P004', name: 'Mouse Logitech MX Master', quantity: 1, price: 99.99 },
  { code_reference: 'S001', name: 'Servicio de Mantenimiento', quantity: 1, price: 75.00 },
  { code_reference: 'S002', name: 'Instalación de Software', quantity: 1, price: 50.00 },
  { code_reference: 'P005', name: 'Disco SSD 1TB Samsung', quantity: 1, price: 129.99 },
  { code_reference: 'P006', name: 'Memoria RAM 16GB', quantity: 1, price: 89.99 },
];

export function ItemsModal({ open, onOpenChange, onAdd }: ItemsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  
  // Filtrar ítems según término de búsqueda
  const filteredItems = SAMPLE_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code_reference.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Actualizar cantidad para un ítem
  const updateQuantity = (code: string, qty: number) => {
    setQtyMap(prev => ({...prev, [code]: qty}));
  };
  
  // Agregar item a la factura
  const handleAddItem = (item: Item) => {
    const quantity = qtyMap[item.code_reference] || 1;
    onAdd({...item, quantity});
    onOpenChange(false);
    // Opcional: resetear cantidad después de añadir
    setQtyMap({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Seleccionar Producto o Servicio</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Buscador */}
          <div className="flex items-center border rounded-md pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre o código" 
              className="border-0 focus-visible:ring-0"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Lista de ítems */}
          <ScrollArea className="h-[300px] rounded-md border p-2">
            {filteredItems.length > 0 ? (
              <div className="space-y-2">
                {filteredItems.map(item => (
                  <div key={item.code_reference} className="flex flex-col p-2 hover:bg-muted/50 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.code_reference}</div>
                      </div>
                      <div className="font-medium">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Cantidad:</span>
                        <Input
                          type="number"
                          value={qtyMap[item.code_reference] || 1}
                          onChange={e => updateQuantity(item.code_reference, parseInt(e.target.value) || 1)}
                          min={1}
                          className="w-16 h-8"
                        />
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddItem(item)}
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No se encontraron productos con ese término
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}