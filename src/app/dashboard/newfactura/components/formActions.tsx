import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function FormActions({ isSubmitting, onCancel }: FormActionsProps) {
  return (
    <Card>
      <CardFooter className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Procesando...</span>
                <span className="animate-spin">⏳</span>
              </>
            ) : "Crear Factura"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}