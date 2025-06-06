// filepath: c:\Users\ASUS\Desktop\Uni\06-Factiva\Front-Factiva\src\app\dashboard\clients\form-sections\LocationSection.tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../hooks/useClientForm';
import { useDepartments } from '../hooks/useDepartments';
import { useMunicipalities } from '../hooks/useMunicipalities';

interface LocationSectionProps {
  form: UseFormReturn<ClientFormValues>;
}

export function LocationSection({ form }: LocationSectionProps) {
  const { departments, loading, error } = useDepartments();
  const selectedDepartment = form.watch('department');
  const { municipalities, loading: loadingMunicipalities, error: errorMunicipalities } = useMunicipalities(selectedDepartment);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Departamento</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"> 
                  <SelectValue placeholder="Seleccione un departamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {loading ? (
                  <SelectItem value="loading" disabled className="text-zinc-500">Cargando...</SelectItem>
                ) : error ? (
                  <SelectItem value="error" disabled className="text-red-500">Error al cargar departamentos</SelectItem>
                ) : departments.length === 0 ? (
                  <SelectItem value="empty" disabled className="text-zinc-500">No hay departamentos disponibles</SelectItem>
                ) : (
                  departments.map((dept) => (
                    <SelectItem
                      key={dept.name}
                      value={dept.name}
                      className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:bg-primary-100 dark:hover:bg-primary-900 focus:bg-primary-100 dark:focus:bg-primary-900 cursor-pointer px-4 py-2 rounded-md transition-colors"
                    >
                      {dept.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {selectedDepartment && (
        <FormField
          control={form.control}
          name="municipality_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Municipio</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]">
                    <SelectValue placeholder="Seleccione un municipio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {loadingMunicipalities ? (
                    <SelectItem value="loading" disabled className="text-zinc-500">Cargando...</SelectItem>
                  ) : errorMunicipalities ? (
                    <SelectItem value="error" disabled className="text-red-500">Error al cargar municipios</SelectItem>
                  ) : municipalities.length === 0 ? (
                    <SelectItem value="empty" disabled className="text-zinc-500">No hay municipios disponibles</SelectItem>
                  ) : (
                    municipalities.map((mun) => (
                      <SelectItem
                        key={mun.id ?? mun.name}
                        value={mun.name}
                        className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:bg-primary-100 dark:hover:bg-primary-900 focus:bg-primary-100 dark:focus:bg-primary-900 cursor-pointer px-4 py-2 rounded-md transition-colors"
                      >
                        {mun.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}