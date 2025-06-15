import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { type Client } from '../models/client.types'
import { OrganizationType } from '../models/enum/OrganizationType'

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export function ClientCard({ client, onDelete, onEdit }: ClientCardProps) {
  // Determinar tipo de organización
  const isEmpresa = client.legal_organization_id === OrganizationType.PERSONA_JURIDICA;
  const tipoTexto = isEmpresa ? 'Empresa' : 'Persona';
  const badgeVariant: 'secondary' | 'outline' = isEmpresa ? 'secondary' : 'outline';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">
            {client.names || client.trade_name || 'Sin nombre'}
          </h3>
          <Badge variant={badgeVariant}>{tipoTexto}</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">ID: </span>
          {client.identification || 'Sin identificación'}
        </p>
        
        {client.email && (
          <p className="text-sm text-muted-foreground mb-1 truncate">
            <span className="font-medium">Email: </span>
            {client.email}
          </p>
        )}
        
        {client.phone && (
          <p className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Teléfono: </span>
            {client.phone}
          </p>
        )}
        
        {client.address && (
          <p className="text-sm text-muted-foreground mb-1 truncate">
            <span className="font-medium">Dirección: </span>
            {client.address}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="border-t bg-muted/20 px-6 py-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4 mr-2" /> Editar
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            // Usar _id si existe, de lo contrario intentar con id
            const clientId = client._id || client.id;
            if (clientId) {
              onDelete(clientId);
            } else {
              alert("Error: No se pudo identificar el ID del cliente");
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}