import React from 'react'
import { Form } from '@/components/ui/form'

// Componentes refactorizados
import { GeneralDataSection } from './components/generalDataSection'
import { CustomerSection } from './components/customerSection'
import { ProductsSection } from './components/productsSection'
import { FormActions } from './components/formActions'

// Hooks personalizados
import { useInvoiceForm } from './hooks/useInvoiceForm'
import { useInvoiceProducts } from './hooks/useInvoiceProducts'
import { useInvoiceSubmission } from './hooks/useInvoiceSubmission'

// Tipos (si necesitamos exportarlos)
import { type FormValues } from './hooks/useInvoiceForm'
import { type Customer } from './models/CustomerModal'
import { type Item } from './models/ItemsModal'

export default function NewFacturaForm() {
  const {
    form, router, customer, setCustomer, custOpen, setCustOpen
  } = useInvoiceForm();
  
  const {
    items, setItems, itemsOpen, setItemsOpen, itemTaxes,
    updateItemTax, updateItemQuantity, removeItem
  } = useInvoiceProducts();
  
  const { isSubmitting, handleSubmit, handleSaveDraft } = 
    useInvoiceSubmission(form, customer, items, itemTaxes, router);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <GeneralDataSection form={form} />
        
        <CustomerSection 
          form={form}
          customer={customer}
          setCustomer={setCustomer}
          custOpen={custOpen}
          setCustOpen={setCustOpen}
        />
        
        <ProductsSection 
          items={items}
          setItems={setItems}
          itemTaxes={itemTaxes}
          updateItemTax={updateItemTax}
          updateItemQuantity={updateItemQuantity}
          removeItem={removeItem}
          itemsOpen={itemsOpen}
          setItemsOpen={setItemsOpen}
        />
        
        <FormActions 
          isSubmitting={isSubmitting}
          onCancel={() => router.push('/dashboard/history')}
        />
      </form>
    </Form>
  );
}