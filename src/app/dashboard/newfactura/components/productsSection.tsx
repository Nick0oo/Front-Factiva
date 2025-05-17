import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { ProductsTable } from './productsTable';
import { ItemsModal, type Item } from '../models/ItemsModal';

interface ProductsSectionProps {
  items: Item[];
  setItems: (items: Item[]) => void;
  itemTaxes: Record<number, string>;
  updateItemTax: (index: number, taxRate: string) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  itemsOpen: boolean;
  setItemsOpen: (open: boolean) => void;
}

export function ProductsSection({
  items, setItems, itemTaxes, updateItemTax, updateItemQuantity,
  removeItem, itemsOpen, setItemsOpen
}: ProductsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Productos y Servicios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Botón para agregar ítems */}
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => setItemsOpen(true)}
            className="w-full sm:w-auto"
          >
            Agregar Ítem
          </Button>
          
          {/* Tabla de productos o mensaje si no hay productos */}
          {items.length > 0 ? (
            <ProductsTable 
              items={items}
              itemTaxes={itemTaxes}
              updateItemTax={updateItemTax}
              updateItemQuantity={updateItemQuantity}
              removeItem={removeItem}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
              No hay ítems agregados a esta factura
            </div>
          )}
          
          {/* Modal de selección de productos */}
          <ItemsModal
            open={itemsOpen}
            onOpenChange={setItemsOpen}
            onAdd={item => setItems(prev => [...prev, item])}
          />
        </div>
      </CardContent>
    </Card>
  );
}