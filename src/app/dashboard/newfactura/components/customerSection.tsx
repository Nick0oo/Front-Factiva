import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { CustomerModal, type Customer } from '../models/CustomerModal';
import { type FormValues } from '../hooks/useInvoiceForm';

interface CustomerSectionProps {
  form: UseFormReturn<FormValues>;
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  custOpen: boolean;
  setCustOpen: (open: boolean) => void;
}

export function CustomerSection({ 
  form, customer, setCustomer, custOpen, setCustOpen 
}: CustomerSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Botón para seleccionar cliente */}
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => setCustOpen(true)}
            className="w-full sm:w-auto"
          >
            {customer ? "Cambiar Cliente" : "Seleccionar Cliente"}
          </Button>
          
          {/* Mostrar datos del cliente seleccionado */}
          {customer && (
            <div className="rounded-md border p-4 bg-muted/30">
              <div className="font-medium">{customer.names}</div>
              <div className="text-sm text-muted-foreground mt-1">
                <span>Documento: {customer.document || customer.identificationNumber || "Sin documento"}</span>
                {customer.partyType && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10">
                    {customer.partyType === 'LEGAL' ? 'Empresa' : 'Persona'}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{customer.email || "Sin email"}</div>
              {customer.address && (
                <div className="text-sm text-muted-foreground mt-1">{customer.address}</div>
              )}
              
              {/* Selector de IVA que solo aparece cuando se ha seleccionado un cliente */}
              <div className="mt-4 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="tribute_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Régimen de IVA</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full max-w-xs">
                            <SelectValue placeholder="Seleccionar régimen de IVA" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="18">Responsable de IVA</SelectItem>
                            <SelectItem value="21">No responsable de IVA</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          {/* Modal de selección de cliente */}
          <CustomerModal 
            open={custOpen} 
            onOpenChange={setCustOpen} 
            onSelect={setCustomer} 
          />
        </div>
      </CardContent>
    </Card>
  );
}