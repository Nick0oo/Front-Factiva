import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../hooks/useClientForm';
import { type ClientData } from '../hooks/useClientData';

interface IdentificationSectionProps {
  clientData: ClientData;
  updateDocumentType: (type: number) => void;
  form: UseFormReturn<ClientFormValues>;
}

export function IdentificationSection({ 
  clientData, 
  updateDocumentType, 
  form 
}: IdentificationSectionProps) {
  return (
    <>
      {/* Tipo de identificación - USANDO ESTADO INDEPENDIENTE */}
      <div className="space-y-2">
        <Label>Tipo de Documento</Label>
        <Select 
          value={clientData.identification_document_id.toString()}
          onValueChange={(value) => updateDocumentType(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Cédula de Ciudadanía</SelectItem>
            <SelectItem value="5">Cédula de Extranjería</SelectItem>
            <SelectItem value="7">Pasaporte</SelectItem>
            <SelectItem value="2">Tarjeta de Identidad</SelectItem>
            <SelectItem value="1">Registro Civil</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Número de identificación - USANDO FORM */}
      <div className="flex-grow">
        <FormField
          control={form.control}
          name="identification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Documento</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}