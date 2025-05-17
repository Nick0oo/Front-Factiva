import { useState } from 'react';
import { type Item } from '../models/ItemsModal';

export function useInvoiceProducts() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [itemTaxes, setItemTaxes] = useState<Record<number, string>>({});
  
  // Actualizar el IVA de un producto
  const updateItemTax = (index: number, taxRate: string) => {
    setItemTaxes(prev => ({...prev, [index]: taxRate}));
  };
  
  // Función para actualizar la cantidad de un ítem
  const updateItemQuantity = (index: number, newQuantity: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };
  
  // Eliminar un ítem de la lista
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    
    // También eliminar su tax_rate y reindexar
    setItemTaxes(prev => {
      const updated = {...prev};
      delete updated[index];
      
      // Reindexar los impuestos restantes
      const newTaxes: Record<number, string> = {};
      Object.keys(updated).forEach((key) => {
        const numKey = parseInt(key);
        if (numKey > index) {
          newTaxes[numKey - 1] = updated[numKey];
        } else {
          newTaxes[numKey] = updated[numKey];
        }
      });
      
      return newTaxes;
    });
  };

  return {
    items,
    setItems,
    itemsOpen,
    setItemsOpen,
    itemTaxes,
    updateItemTax,
    updateItemQuantity,
    removeItem,
  };
}