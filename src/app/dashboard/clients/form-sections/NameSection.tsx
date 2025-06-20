import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../hooks/useClientForm';

interface NameSectionProps {
  form: UseFormReturn<ClientFormValues>;
}

export function NameSection({ form }: NameSectionProps) {
  return (
    <>
      {/* Nombre o Razón Social */}
      <FormField
        control={form.control}
        name="names"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombres y Apellidos</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}