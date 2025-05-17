import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
}

export function FormActions({ isSubmitting, onCancel, onSaveDraft }: FormActionsProps) {
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
            variant="secondary" 
            type="button"
            disabled={isSubmitting}
            onClick={onSaveDraft}
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
  );
}