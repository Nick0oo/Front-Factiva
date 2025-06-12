import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { X } from 'lucide-react';
import { type Item } from '../models/ItemsModal';

interface ProductsTableProps {
  items: Item[];
  itemTaxes: Record<number, string>;
  updateItemTax: (index: number, taxRate: string) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
}

export function ProductsTable({
  items, itemTaxes, updateItemTax, updateItemQuantity, removeItem
}: ProductsTableProps) {
  
  // Función para calcular el total de un ítem incluyendo IVA
  const calculateItemTotal = (item: Item, index: number) => {
    const baseTotal = (item.quantity || 1) * (item.price || 0);
    const taxRate = itemTaxes[index] ? parseInt(itemTaxes[index]) : 0;
    
    if (taxRate === 0) {
      return baseTotal;
    } else {
      return baseTotal * (1 + taxRate / 100);
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="text-left p-2 px-4">Producto</th>
            <th className="text-center p-2">Cantidad</th>
            <th className="text-center p-2">IVA</th>
            <th className="text-right p-2">Precio</th>
            <th className="text-right p-2">Total</th>
            <th className="w-10 p-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b last:border-0 hover:bg-muted/20">
              <td className="p-3 px-4">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">Código: {item.code_reference}</div>
              </td>
              <td className="text-center p-3">
                <Input 
                  type="number"
                  min={1}
                  max={item.stock_quantity || 999}
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    updateItemQuantity(index, value);
                  }}
                  className="w-20 h-8 mx-auto text-center"
                />
              </td>
              <td className="text-center p-3">
                <Select 
                  value={itemTaxes[index] || ""} 
                  onValueChange={(value) => updateItemTax(index, value)}
                >
                  <SelectTrigger className="w-20 h-8 mx-auto text-center">
                    <SelectValue placeholder="IVA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="19">19%</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="text-right p-3">${item.price?.toLocaleString('es-CO', {minimumFractionDigits: 2})}</td>
              <td className="text-right p-3">
                ${calculateItemTotal(item, index).toLocaleString('es-CO', {minimumFractionDigits: 2})}
              </td>
              <td className="p-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => removeItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-muted/30 font-medium">
            <td colSpan={4} className="text-right p-3">Total:</td>
            <td className="text-right p-3">
              ${items.reduce((sum, item, index) => sum + calculateItemTotal(item, index), 0).toLocaleString('es-CO', {minimumFractionDigits: 2})}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}