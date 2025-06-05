"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { jwtDecode } from 'jwt-decode'
import { ClientCard } from './ClientCard'
import { ClientsLoadingState } from './ClientsLoadingState'
import { ClientsEmptyState } from './ClientsEmptyState'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Client } from '../models/client.types'

// Tipo para el payload del JWT
interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

interface ClientsListProps {
  onEdit: (client: Client) => void;
  refreshFlag: number;
}

export function ClientsList({ onEdit, refreshFlag }: ClientsListProps) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Obtener el ID del usuario del token JWT
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encontró token de autenticación');
          setLoading(false);
          return;
        }
        
        // Decodificar el token para obtener el ID de usuario
        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.sub;
        
        // Obtener los clientes del usuario específico
        const response = await api.get(`/invoice-parties/user/${userId}`);
        console.log("Datos de clientes recibidos:", response.data);
        console.log("Primer cliente:", response.data[0]); // Ver estructura de un cliente
        setClients(response.data);
        setError(null);
      } catch (error: any) {
        console.error('Error al cargar clientes:', error);
        setError('No se pudieron cargar los clientes. Intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [refreshFlag]);
  
  const handleDelete = async (id: string) => {
    if (!id) {
      alert("Error: ID de cliente no válido");
      return;
    }
    
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;
    
    try {
      console.log("Intentando eliminar cliente con ID:", id);
      
      // Llamada a la API para eliminar el cliente
      await api.delete(`/invoice-parties/${id}`);
      
      // Actualizar el estado para reflejar el cambio
      setClients(prevClients => prevClients.filter(client => 
        // Comparar con _id o id según esté disponible
        (client._id && client._id !== id) || (client.id && client.id !== id)
      ));
      
      alert('Cliente eliminado con éxito');
    } catch (error: any) {
      console.error('Error al eliminar cliente:', error);
      
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Error al eliminar el cliente. Inténtelo nuevamente.');
      }
    }
  };
  
  // Función para añadir el cliente recién creado a la lista
  const handleClientCreated = (newClient: Client) => {
    setClients(prevClients => [newClient, ...prevClients]);
  };
  
  // Mostrar estado de carga
  if (loading) {
    return <ClientsLoadingState />;
  }
  
  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }
  
  // Mostrar estado vacío
  if (clients.length === 0) {
    return <ClientsEmptyState />;
  }
  
  // Mostrar lista de clientes
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <ClientCard 
            key={client._id || client.id} 
            client={client} 
            onDelete={handleDelete}
            onEdit={() => onEdit(client)}
          />
        ))}
      </div>
    </>
  );
}