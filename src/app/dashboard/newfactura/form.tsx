import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CustomerModal, Customer } from './models/CustomerModal'
import { ItemsModal, Item } from './models/ItemsModal'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, CreditCard, Package, Tag, User, X, Percent } from 'lucide-react'
import api from "@/lib/axios"
import { useRouter } from 'next/navigation'

// Esquema actualizado con tribute_id
const formSchema = z.object({
  numbering_range_id: z.string().min(1, 'Requerido'),
  reference_code: z.string().min(1, 'Requerido'),
  observation: z.string().optional(),
  payment_method_code: z.string().min(1, 'Requerido'),
  tribute_id: z.string().min(1, 'Requerido'), // Campo para el IVA del cliente
})
type FormValues = z.infer<typeof formSchema>

export default function NewFacturaForm() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [custOpen, setCustOpen] = useState(false)
  const [itemsOpen, setItemsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Manejar los tax_rate (IVA) por cada ítem
  const [itemTaxes, setItemTaxes] = useState<Record<number, string>>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numbering_range_id: '',
      reference_code: '',
      observation: '',
      payment_method_code: '10', // Por defecto efectivo según la documentación
      tribute_id: '', // Valor inicial para el IVA
    },
  })

  // Actualizar el IVA de un producto
  const updateItemTax = (index: number, taxRate: string) => {
    setItemTaxes(prev => ({...prev, [index]: taxRate}))
  }

  const onSubmit = async (data: FormValues) => {
    // Verificaciones básicas (sin cambios)
    if (!customer) {
      alert("Error: Debe seleccionar un cliente para la factura");
      return;
    }

    if (items.length === 0) {
      alert("Error: Debe agregar al menos un producto o servicio");
      return;
    }

    // Verificar que todos los ítems tengan un IVA asignado
    const missingTaxItems = items.filter((_, index) => !itemTaxes[index]);
    if (missingTaxItems.length > 0) {
      alert("Error: Todos los productos deben tener un porcentaje de IVA asignado");
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar los datos del cliente (sin cambios)
      const customerData = {
        identification: customer.document || customer.identificationNumber,
        dv: customer.dv || undefined,
        company: customer.company || undefined,
        trade_name: customer.tradeName || undefined,
        names: customer.names,
        address: customer.address || "",
        email: customer.email || "",
        phone: customer.phone || "",
        legal_organization_id: customer.legal_organization_id || (customer.partyType === 'LEGAL' ? 1 : 2),
        tribute_id: parseInt(data.tribute_id),
        identification_document_id: customer.identification_document_id || 3,
        municipality_id: customer.municipality_id || 1
      };

      // ID del cliente (receiverId según el controlador)
      const receiverId = customer.id;

      // Preparar los ítems - ACTUALIZADO con los campos faltantes
      const itemsData = items.map((item, index) => {
        // Calcular el total_Price del ítem
        const total_Price = item.quantity * item.price;
        
        return {
          productId: item.id, // ID del producto
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          tax_rate: itemTaxes[index] || "19",
          unit_measure_id: item.unit_measure || 70,
          standard_code_id: item.standard_code_id || 999,
          // Campos adicionales requeridos
          total_Price: total_Price, // Precio total del ítem
          is_excluded: 0, // 0 = no excluido, 1 = excluido
          tribute_id: parseInt(itemTaxes[index] || "19"), // Usar el mismo valor que tax_rate como tribute_id
          total_amount: total_Price // Alternativa si total_Price no funciona
        };
      });

      // Calcular el total general
      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

      // Construir el payload con los campos adicionales
      const payload = {
        numbering_range_id: parseInt(data.numbering_range_id),
        reference_code: data.reference_code,
        observation: data.observation || "",
        payment_method_code: parseInt(data.payment_method_code),
        receiverId, // ID del cliente
        items: itemsData,
        // Campo adicional requerido
        totalAmount: totalAmount, // Total general de la factura
        total_amount: totalAmount, // Alternativa si totalAmount no funciona
      };

      console.log("Payload completo para enviar:", payload);
      
      // Enviar al backend
      const response = await api.post('/invoice/create', payload);
      
      alert("Éxito: La factura se ha creado correctamente");
      
      // Redirigir a la lista de facturas
      router.push('/dashboard/invoices');
    } catch (error: any) {
      console.error("Error al crear factura:", error);
      alert(`Error: ${error.response?.data?.message || "Error al crear la factura"}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Nueva función para guardar como borrador - CORREGIDA
  const saveDraft = async () => {
    // Verificaciones básicas (sin cambios)
    if (!customer) {
      alert("Error: Debe seleccionar un cliente para la factura");
      return;
    }

    if (items.length === 0) {
      alert("Error: Debe agregar al menos un producto o servicio");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Obtener los valores actuales del formulario
      const formValues = form.getValues();
      
      // ID del cliente (receiverId según el controlador)
      const receiverId = customer.id;

      // Preparar los ítems - ACTUALIZADO con los campos faltantes
      const itemsData = items.map((item) => {
        // Calcular el total_Price del ítem
        const total_Price = item.quantity * item.price;
        
        return {
          productId: item.id, // ID del producto
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          tax_rate: "0", // Por defecto 0% para borradores
          // Campos adicionales requeridos
          total_Price: total_Price, // Precio total del ítem
          is_excluded: 0, // 0 = no excluido, 1 = excluido
          tribute_id: 0, // ID de tributo 0 (sin tributo) para borradores
          total_amount: total_Price // Alternativa si total_Price no funciona
        };
      });

      // Calcular el total general
      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

      // Construir el payload del borrador - ACTUALIZADO
      // Cambiamos 'draft' por 'pending' que es un valor aceptado
      const payload = {
        numbering_range_id: parseInt(formValues.numbering_range_id || "0"),
        reference_code: formValues.reference_code || "BORRADOR-" + new Date().getTime(),
        observation: (formValues.observation || "") + " [BORRADOR]", // Añadimos indicador en la observación
        payment_method_code: parseInt(formValues.payment_method_code || "10"),
        status: "pending", // Valor aceptado en el enum del backend
        receiverId, // ID del cliente
        items: itemsData,
        // Campo adicional requerido
        totalAmount: totalAmount, // Total general de la factura
        total_amount: totalAmount, // Alternativa si totalAmount no funciona
        is_draft: true // Campo adicional para identificar que es un borrador
      };

      console.log("Enviando borrador:", payload);
      
      // Enviar al backend usando la misma ruta
      const response = await api.post('/invoice/create', payload);
      
      console.log("¡Borrador guardado con éxito!", response.data);
      alert("El borrador se ha guardado correctamente");
    } catch (error: any) {
      console.error("Error al guardar borrador:", error);
      alert(`Error: ${error.response?.data?.message || "Error al guardar el borrador"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar un ítem de la lista
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    
    // También eliminar su tax_rate
    setItemTaxes(prev => {
      const updated = {...prev};
      delete updated[index];
      
      // Reindexar los impuestos restantes
      const newTaxes: Record<number, string> = {};
      Object.keys(updated).forEach((key, i) => {
        const numKey = parseInt(key);
        if (numKey > index) {
          newTaxes[numKey - 1] = updated[numKey];
        } else {
          newTaxes[numKey] = updated[numKey];
        }
      });
      
      return newTaxes;
    });
  }

  // Función para actualizar la cantidad de un ítem
  const updateItemQuantity = (index: number, newQuantity: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Datos Generales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Input {...field} placeholder="Ej: FAC-2023-001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        <SelectItem value="20">Cheque</SelectItem>
                        <SelectItem value="23">Transferencia Débito</SelectItem>
                        <SelectItem value="24">Transferencia Crédito</SelectItem>
                        <SelectItem value="42">Consignación bancaria</SelectItem>
                        <SelectItem value="45">Transferencia bancaria</SelectItem>
                        <SelectItem value="47">Tarjeta Crédito</SelectItem>
                        <SelectItem value="48">Tarjeta Débito</SelectItem>
                        <SelectItem value="49">Tarjeta Prepago</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setCustOpen(true)}
                className="w-full sm:w-auto"
              >
                {customer ? "Cambiar Cliente" : "Seleccionar Cliente"}
              </Button>
              
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
              <CustomerModal open={custOpen} onOpenChange={setCustOpen} onSelect={setCustomer} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos y Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setItemsOpen(true)}
                className="w-full sm:w-auto"
              >
                Agregar Ítem
              </Button>
              
              {items.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left p-2 px-4">Producto</th>
                        <th className="text-center p-2">Cantidad</th>
                        <th className="text-center p-2">IVA</th>
                        <th className="text-right p-2">Precio</th>
                        <th className="text-right p-2">Total</th>
                        <th className="w-10 p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="p-3 px-4">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">Código: {item.code_reference}</div>
                          </td>
                          <td className="text-center p-3">
                            <Input 
                              type="number"
                              min={1}
                              max={item.stock_quantity || 999}
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                updateItemQuantity(index, value);
                              }}
                              className="w-20 h-8 mx-auto text-center"
                            />
                          </td>
                          <td className="text-center p-3">
                            <Select 
                              value={itemTaxes[index] || ""} 
                              onValueChange={(value) => updateItemTax(index, value)}
                            >
                              <SelectTrigger className="w-20 h-8 mx-auto text-center">
                                <SelectValue placeholder="IVA" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0%</SelectItem>
                                <SelectItem value="5">5%</SelectItem>
                                <SelectItem value="19">19%</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="text-right p-3">${item.price?.toLocaleString('es-CO', {minimumFractionDigits: 2})}</td>
                          <td className="text-right p-3">
                            ${((item.quantity || 1) * (item.price || 0)).toLocaleString('es-CO', {minimumFractionDigits: 2})}
                          </td>
                          <td className="p-3">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => removeItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/30 font-medium">
                        <td colSpan={4} className="text-right p-3">Total:</td>
                        <td className="text-right p-3">
                          ${items.reduce((sum, item) => sum + ((item.quantity || 1) * (item.price || 0)), 0).toLocaleString('es-CO', {minimumFractionDigits: 2})}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
                  No hay ítems agregados a esta factura
                </div>
              )}
              <ItemsModal
                open={itemsOpen}
                onOpenChange={setItemsOpen}
                onAdd={item => setItems(prev => [...prev, item])}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardFooter className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => router.push('/dashboard')}
            >
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                type="button"
                disabled={isSubmitting}
                onClick={saveDraft} // Conectamos la función al botón
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Guardando...</span>
                    <span className="animate-spin">⏳</span>
                  </>
                ) : "Guardar Borrador"}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Procesando...</span>
                    <span className="animate-spin">⏳</span>
                  </>
                ) : "Crear y Enviar"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}