import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function ClientsEmptyState() {
  const router = useRouter()
  
  return (
    <div className="text-center py-12 border rounded-md bg-muted/10">
      <p className="text-muted-foreground">No hay clientes registrados</p>
      <Button 
        variant="outline" 
        className="mt-4" 
        onClick={() => router.push('/dashboard/clients/new')}
      >
        Agregar cliente
      </Button>
    </div>
  );
}