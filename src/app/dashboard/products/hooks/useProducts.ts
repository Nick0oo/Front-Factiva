import { useState, useEffect, useCallback } from 'react';
import { Product } from '../models/product.model';
import { jwtDecode } from 'jwt-decode';
import { useNotify } from '@/hooks/useNotify';

export interface Tribute {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface UnitMeasure {
  id: number;
  code: string;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useNotify();

  // Tributos
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loadingTributes, setLoadingTributes] = useState(false);
  const [errorTributes, setErrorTributes] = useState<string | null>(null);

  // Unidades de medida
  const [unitMeasures, setUnitMeasures] = useState<UnitMeasure[]>([]);
  const [loadingUnitMeasures, setLoadingUnitMeasures] = useState(false);
  const [errorUnitMeasures, setErrorUnitMeasures] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autenticado');
      const { sub: userId } = jwtDecode<{ sub: string }>(token);
      const res = await fetch(`${API_URL}/products/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      notifyError(err.message || 'Error al obtener los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTributes = useCallback(async () => {
    setLoadingTributes(true);
    setErrorTributes(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/catalogs/tributes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al obtener tributos');
      const data = await res.json();
      setTributes(data.data || []);
    } catch (err: any) {
      setErrorTributes(err.message);
      notifyError(err.message || 'Error al obtener los tributos');
    } finally {
      setLoadingTributes(false);
    }
  }, []);

  const fetchUnitMeasures = useCallback(async () => {
    setLoadingUnitMeasures(true);
    setErrorUnitMeasures(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/catalogs/unit-measures`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al obtener unidades de medida');
      const data = await res.json();
      setUnitMeasures(data.data || []);
    } catch (err: any) {
      setErrorUnitMeasures(err.message);
      notifyError(err.message || 'Error al obtener las unidades de medida');
    } finally {
      setLoadingUnitMeasures(false);
    }
  }, []);

  const createProduct = useCallback(async (product: Omit<Product, '_id'>) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear producto');
      }
      notifySuccess('Producto creado con éxito');
      await fetchProducts();
    } catch (err: any) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, notifyError, notifySuccess]);

  const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar producto');
      }
      notifySuccess('Producto actualizado con éxito');
      await fetchProducts();
    } catch (err: any) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, notifyError, notifySuccess]);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message ||'Error al eliminar producto');
      }
      notifySuccess('Producto eliminado con éxito');
      await fetchProducts();
    } catch (err: any) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, notifyError, notifySuccess]);

  useEffect(() => {
    fetchProducts();
    fetchTributes();
    fetchUnitMeasures();
  }, [fetchProducts, fetchTributes, fetchUnitMeasures]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    tributes,
    loadingTributes,
    errorTributes,
    unitMeasures,
    loadingUnitMeasures,
    errorUnitMeasures,
  };
} 