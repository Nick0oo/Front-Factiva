import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Loader2 } from 'lucide-react'
// Importar la instancia personalizada de axios y jwtDecode
import api from "@/lib/axios"
import { jwtDecode } from "jwt-decode"

// Definir el tipo para el payload del JWT
interface JWTPayload { sub: string }

export interface Item {
  id?: string
  code_reference: string
  name: string
  quantity: number
  price: number
  // Campos adicionales de la entidad Product
  unit_measure?: number
  standard_code_id?: number
  stock_quantity?: number
  description?: string
  is_active?: boolean
}

interface ItemsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (item: Item) => void
}

export function ItemsModal({ open, onOpenChange, onAdd }: ItemsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Función para obtener los productos desde la API
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de autenticación');
      }
      
      // Extraer el ID del usuario del token JWT
      const { sub: userId } = jwtDecode<JWTPayload>(token);
      if (!userId) {
        throw new Error('No se pudo extraer el ID del usuario del token');
      }

      // Realizar la petición al endpoint con el userId extraído del token
      const response = await api.get(`/products/user/${userId}`);
      
      console.log("Productos recibidos:", response.data);
      
      // Mapear la respuesta a la estructura de Item
      const mappedItems: Item[] = response.data.map((product: any) => ({
        id: product._id || product.id,
        code_reference: product.code_reference,
        name: product.name,
        price: product.price,
        quantity: 1, // Valor por defecto para la UI
        unit_measure: product.unit_measure,
        standard_code_id: product.standard_code_id,
        stock_quantity: product.stock_quantity || 0,
        description: product.description,
        is_active: product.is_active
      }));
      
      setItems(mappedItems);
    } catch (err: any) {
      console.error('Error al obtener productos:', err);
      setError(`No se pudieron cargar los productos: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar productos cuando se abre el modal
  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);
  
  // Filtrar ítems según término de búsqueda
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code_reference.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Simplificamos la función handleAddItem
  const handleAddItem = (item: Item) => {
    // Siempre enviamos quantity=1 y dejamos que el usuario la modifique después
    onAdd({...item, quantity: 1});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Seleccionar Producto o Servicio</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Buscador */}
          <div className="flex items-center border rounded-md pl-3 transition-all hover:border-primary/50">
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
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                <p>Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="py-10 text-center">
                <p className="text-destructive mb-2">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchProducts} 
                  className="mt-2"
                >
                  Reintentar
                </Button>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="space-y-2">
                {filteredItems.map(item => (
                  <div key={item.id || item.code_reference} className="flex p-3 hover:bg-muted/50 rounded-md border border-muted justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-x-2">
                        <span>Código: {item.code_reference}</span>
                        {item.stock_quantity !== undefined && (
                          <span>Stock: {item.stock_quantity}</span>
                        )}
                      </div>
                      {item.description && (
                        <div className="text-xs mt-1 text-muted-foreground max-w-[250px] truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-medium text-primary">
                        ${item.price.toLocaleString('es-CO', {minimumFractionDigits: 2})}
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="hover:bg-primary/10"
                        onClick={() => handleAddItem(item)}
                      >
                        Seleccionar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-muted-foreground">
                {items.length === 0 ? (
                  <>
                    <p className="mb-2">No hay productos registrados</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchProducts} 
                      className="mt-2"
                    >
                      Recargar
                    </Button>
                  </>
                ) : (
                  <p>No se encontraron productos con ese término</p>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}