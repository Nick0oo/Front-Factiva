import React from 'react';
import { Product } from '../models/product.model';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No hay productos registrados.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={() => onEdit(product)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}; 