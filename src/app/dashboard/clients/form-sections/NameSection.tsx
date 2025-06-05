import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../hooks/useClientForm';

interface NameSectionProps {
  form: UseFormReturn<ClientFormValues>;
  isCompany: boolean;
}

export function NameSection({ form, isCompany }: NameSectionProps) {
  return (
    <>
      {/* Nombre o Razón Social */}
      <FormField
        control={form.control}
        name="names"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isCompany ? 'Razón Social' : 'Nombres y Apellidos'}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Nombre comercial (solo para empresas) */}
      {isCompany && (
        <FormField
          control={form.control}
          name="trade_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Comercial</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* Empresa (solo para personas naturales) */}
      {!isCompany && (
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa (opcional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}