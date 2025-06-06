import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';

interface Department {
  name: string;
}

interface JWTPayload {
  sub: string;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        const response = await api.get('/municipality/departments');
        console.log('Respuesta del backend:', response.data);
        
        // Verificar si la respuesta es un array
        if (Array.isArray(response.data)) {
          setDepartments(response.data.map((d: string) => ({ name: d })));
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Si la respuesta está dentro de un objeto con propiedad data
          setDepartments(response.data.data);
        } else {
          console.error('Formato de respuesta inesperado:', response.data);
          setError('Formato de respuesta inesperado del servidor');
        }
      } catch (err: any) {
        console.error('Error al cargar departamentos:', err);
        setError(err.response?.data?.message || 'Error al cargar los departamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
} 