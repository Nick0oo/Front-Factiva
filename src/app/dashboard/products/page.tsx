'use client';
import React, { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { Product } from './models/product.model';
import { ProductList } from './components/ProductList';
import { ProductFormModal } from './components/ProductFormModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ProductsPage = () => {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    tributes,
    loadingTributes,
    errorTributes,
    unitMeasures,
    loadingUnitMeasures,
    errorUnitMeasures,
  } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const handleSubmit = async (product: Omit<Product, '_id'>) => {
    if (editProduct && editProduct._id) {
      await updateProduct(editProduct._id, product);
    } else {
      await createProduct(product);
    }
    setModalOpen(false);
    setEditProduct(null);
  };

  // Para edición futura
  // const handleUpdate = async (product: Product) => { ... }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button
          variant="default"
          onClick={() => {
            setEditProduct(null);
            setModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Crear producto
        </Button>
      </div>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ProductList
        products={products}
        onEdit={(product) => {
          setEditProduct(product);
          setModalOpen(true);
        }}
        onDelete={deleteProduct}
      />
      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        onSubmit={handleSubmit}
        initialData={editProduct || undefined}
      />
    </div>
  );
};

export default ProductsPage; 