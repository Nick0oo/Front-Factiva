import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Building, User, Loader2 } from 'lucide-react'
// Importar la instancia personalizada de axios y jwtDecode
import api from "@/lib/axios"
import { jwtDecode } from "jwt-decode"

// Definir el tipo para el payload del JWT
interface JWTPayload { sub: string }

export interface Customer {
  id: string
  document: string
  names: string
  email: string
  phone?: string
  address?: string
  company?: string
  // Campos adicionales que podrían venir del backend
  partyType?: string
  tradeName?: string
  identificationNumber?: string
  dv?: string
  legal_organization_id?: number
  tribute_id?: number
  identification_document_id?: number
  municipality_id?: number
}

interface CustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (customer: Customer) => void
}

export function CustomerModal({ open, onOpenChange, onSelect }: CustomerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar información de usuario al inicio (agregar para depuración)
  useEffect(() => {
    if (open) {
      const token = localStorage.getItem('token');
      console.log("Token encontrado:", token ? "Sí" : "No");
      
      if (token) {
        try {
          const { sub: userId } = jwtDecode<JWTPayload>(token);
          console.log("Usuario ID extraído del token:", userId);
        } catch (err) {
          console.error("Error al decodificar el token:", err);
        }
      }
    }
  }, [open]);

  // Función para obtener los clientes desde la API
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de autenticación');
      }
      
      // Extraer el ID del usuario del token JWT en lugar de buscarlo en localStorage
      const { sub: userId } = jwtDecode<JWTPayload>(token);
      if (!userId) {
        throw new Error('No se pudo extraer el ID del usuario del token');
      }

      // Realizar la petición al endpoint con el userId extraído del token
      const response = await api.get(`/invoice-parties/user/${userId}`);
      
      console.log("Datos recibidos:", response.data);
      
      // Mapear la respuesta a la estructura de Customer
      const mappedCustomers: Customer[] = response.data.map((party: any) => ({
        id: party._id || party.id || '',
        document: party.identification || party.identificationNumber || '',
        names: party.names || party.trade_name || party.tradeName || '',
        email: party.email || '',
        phone: party.phone || '',
        address: party.address || '',
        company: party.company || party.trade_name || '',
        // Campos adicionales
        partyType: party.legal_organization_id === 1 ? 'LEGAL' : 'NATURAL',
        tradeName: party.trade_name || party.tradeName || '',
        identificationNumber: party.identification || party.identificationNumber || '',
        // Otros campos
        dv: party.dv,
        legal_organization_id: party.legal_organization_id,
        tribute_id: party.tribute_id,
        identification_document_id: party.identification_document_id,
        municipality_id: party.municipality_id
      }));
      
      setCustomers(mappedCustomers);
    } catch (err: any) {
      console.error('Error al obtener clientes:', err);
      setError(`No se pudieron cargar los clientes: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar clientes cuando se abre el modal
  useEffect(() => {
    if (open) {
      fetchCustomers();
    }
  }, [open]);
  
  // Filtrar clientes según término de búsqueda
  const filteredCustomers = customers.filter(customer => 
    customer.names.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.document.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Seleccionar Cliente</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Buscador y botón de Nuevo Cliente */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md pl-3 transition-all hover:border-primary/50 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre, documento o email" 
                className="border-0 focus-visible:ring-0"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="whitespace-nowrap" 
              onClick={() => {
                alert("Funcionalidad de agregar nuevo cliente en desarrollo");
              }}
            >
              + Nuevo Cliente
            </Button>
          </div>
          
          {/* Lista de clientes */}
          <ScrollArea className="h-[300px] rounded-md border p-2">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                <p>Cargando clientes...</p>
              </div>
            ) : error ? (
              <div className="py-10 text-center">
                <p className="text-destructive mb-2">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchCustomers} 
                  className="mt-2"
                >
                  Reintentar
                </Button>
              </div>
            ) : filteredCustomers.length > 0 ? (
              <div className="space-y-2">
                {filteredCustomers.map(customer => (
                  <div 
                    key={customer.id} 
                    className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                    onClick={() => {
                      onSelect(customer);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex gap-3">
                      {customer.company || customer.partyType === 'LEGAL' ? (
                        <Building className="h-5 w-5 text-primary/70" />
                      ) : (
                        <User className="h-5 w-5 text-primary/70" />
                      )}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {customer.names}
                          {customer.partyType === 'LEGAL' && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Empresa</span>
                          )}
                          {customer.partyType === 'NATURAL' && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Persona</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div className="flex flex-wrap gap-x-2">
                            <span className="whitespace-nowrap">Doc: {customer.document}</span>
                            {customer.email && <span className="whitespace-nowrap">Email: {customer.email}</span>}
                          </div>
                          {customer.address && <div className="mt-1 truncate max-w-[200px]">{customer.address}</div>}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-primary/10">
                      Seleccionar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-muted-foreground">
                {customers.length === 0 ? (
                  <>
                    <p className="mb-2">No hay clientes registrados</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchCustomers} 
                      className="mt-2"
                    >
                      Recargar
                    </Button>
                  </>
                ) : (
                  <p>No se encontraron clientes con ese término</p>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}