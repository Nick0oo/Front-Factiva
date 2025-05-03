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
import { Calendar, CreditCard, Package, Tag, User, X } from 'lucide-react'

// esquema básico de validación
const formSchema = z.object({
  numbering_range_id: z.string().min(1, 'Requerido'),
  reference_code:    z.string().min(1, 'Requerido'),
  observation:       z.string().optional(),
  payment_method_code: z.string().min(1, 'Requerido'),
})
type FormValues = z.infer<typeof formSchema>

export default function NewFacturaForm() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [custOpen, setCustOpen] = useState(false)
  const [itemsOpen, setItemsOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numbering_range_id: '',
      reference_code: '',
      observation: '',
      payment_method_code: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    const payload = { ...data, customer, items }
    console.log(payload)
    // ...envío al backend
  }

  // Eliminar un ítem de la lista
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

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
                      <Input {...field} placeholder="Ej: F001" />
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
                      <Input {...field} placeholder="Ingrese el código de referencia" />
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
                        <SelectItem value="01">Contado</SelectItem>
                        <SelectItem value="02">Crédito</SelectItem>
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
                  <div className="text-sm text-muted-foreground mt-1">{customer.document || "Sin documento"}</div>
                  <div className="text-sm text-muted-foreground">{customer.email || "Sin email"}</div>
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
                            <div className="text-xs text-muted-foreground">{item.code}</div>
                          </td>
                          <td className="text-center p-3">{item.quantity || 1}</td>
                          <td className="text-right p-3">${item.price?.toFixed(2) || "0.00"}</td>
                          <td className="text-right p-3">
                            ${((item.quantity || 1) * (item.price || 0)).toFixed(2)}
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
                        <td colSpan={3} className="text-right p-3">Total:</td>
                        <td className="text-right p-3">
                          ${items.reduce((sum, item) => sum + ((item.quantity || 1) * (item.price || 0)), 0).toFixed(2)}
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
            <Button variant="outline" type="button">
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" type="button">
                Guardar Borrador
              </Button>
              <Button type="submit">
                Crear y Enviar
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}