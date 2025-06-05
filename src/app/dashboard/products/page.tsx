'use client';
import React, { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { Product } from './models/product.model';
import { ProductList } from './components/ProductList';
import { ProductFormModal } from './components/ProductFormModal';

const ProductsPage = () => {
  const {
    products,
    loading,
    error,
    createProduct,
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

  const handleCreate = async (product: Omit<Product, '_id'>) => {
    await createProduct(product);
    setModalOpen(false);
  };

  // Para edición futura
  // const handleUpdate = async (product: Product) => { ... }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditProduct(null);
            setModalOpen(true);
          }}
        >
          Crear producto
        </button>
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
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        initialData={editProduct || undefined}
        tributes={tributes}
        loadingTributes={loadingTributes}
        errorTributes={errorTributes}
        unitMeasures={unitMeasures}
        loadingUnitMeasures={loadingUnitMeasures}
        errorUnitMeasures={errorUnitMeasures}
      />
    </div>
  );
};

export default ProductsPage; 