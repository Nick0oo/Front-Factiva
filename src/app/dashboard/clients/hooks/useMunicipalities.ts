import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Municipality {
  id?: number;
  name: string;
}

export function useMunicipalities(departmentName: string | undefined) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentName) {
      setMunicipalities([]);
      return;
    }
    const fetchMunicipalities = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/municipality/department/${encodeURIComponent(departmentName)}`);
        if (Array.isArray(response.data)) {
          setMunicipalities(
            response.data.map((m: any) =>
              typeof m === 'string'
                ? { name: m }
                : { id: m.id, name: m.name }
            )
          );
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setMunicipalities(
            response.data.data.map((m: any) =>
              typeof m === 'string'
                ? { name: m }
                : { id: m.id, name: m.name }
            )
          );
        } else {
          setError('Formato de respuesta inesperado del servidor');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar municipios');
      } finally {
        setLoading(false);
      }
    };
    fetchMunicipalities();
  }, [departmentName]);

  return { municipalities, loading, error };
} 