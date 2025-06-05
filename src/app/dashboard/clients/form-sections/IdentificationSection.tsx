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
  isCompany: boolean;
  form: UseFormReturn<ClientFormValues>;
}

export function IdentificationSection({ 
  clientData, 
  updateDocumentType, 
  isCompany, 
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
            {isCompany ? (
              <SelectItem value="6">NIT</SelectItem> 
            ) : (
              <>
                <SelectItem value="3">Cédula de Ciudadanía</SelectItem>
                <SelectItem value="5">Cédula de Extranjería</SelectItem>
                <SelectItem value="7">Pasaporte</SelectItem>
                <SelectItem value="2">Tarjeta de Identidad</SelectItem>
                <SelectItem value="1">Registro Civil</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      
      {/* Número de identificación - USANDO FORM */}
      <div className="flex gap-3">
        <div className="flex-grow">
          <FormField
            control={form.control}
            name="identification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de {isCompany ? 'NIT' : 'Documento'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Dígito de verificación (solo para NIT) - USANDO FORM */}
        {isCompany && (
          <div className="w-20">
            <FormField
              control={form.control}
              name="dv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DV</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0} 
                      max={9} 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </>
  );
}