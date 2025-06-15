import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, Tag } from 'lucide-react';
import { type FormValues } from '../hooks/useInvoiceForm';

interface GeneralDataSectionProps {
  form: UseFormReturn<FormValues>;
}

export function GeneralDataSection({ form }: GeneralDataSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos Generales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo de Rango de Numeración */}
          <FormField
            control={form.control}
            name="numbering_range_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Rango de Numeración
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el rango de numeración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">Factura Electrónica (FE)</SelectItem>
                      <SelectItem value="9">Factura de Exportación (FE-E)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Campo de Método de Pago */}
          <FormField
            control={form.control}
            name="payment_method_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Método de Pago
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Efectivo</SelectItem>
                      <SelectItem value="42">Consignación bancaria</SelectItem>
                      <SelectItem value="20">Cheque</SelectItem>
                      <SelectItem value="47">Transferencia bancaria</SelectItem>
                      <SelectItem value="71">Bonos</SelectItem>
                      <SelectItem value="72">Cupones</SelectItem>
                      <SelectItem value="1">Medio de pago no definido</SelectItem>
                      <SelectItem value="48">Tarjeta Crédito</SelectItem>
                      <SelectItem value="49">Tarjeta Débito</SelectItem>
                      <SelectItem value="zzz">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Observaciones */}
          <FormField
            control={form.control}
            name="observation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observación</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Agrega cualquier nota u observación relevante"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de Código de Referencia solo lectura */}
          <FormField
            control={form.control}
            name="reference_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Código de Referencia
                </FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}