import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Product } from '../models/product.model';
import { ProductIdentification } from '../models/product-identification.enum';
import { UnitMeasure } from '../models/unit-measure.enum';
import { Tribute } from '../models/tribute.enum';


interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  // Normalizar valores para enums (pueden venir como objeto o primitivo)
  function getEnumValue(val: any) {
    if (val && typeof val === 'object') {
      if ('id' in val) return val.id;
      if ('code' in val) return val.code;
      if ('name' in val) return val.name;
      return '';
    }
    return val;
  }
  const standardCodeId = getEnumValue(product.standard_code_id);
  const unitMeasure = getEnumValue(product.unit_measure);
  const tributeId = getEnumValue(product.tribute_id);

  let codeName = ProductIdentification[standardCodeId as keyof typeof ProductIdentification] || standardCodeId || 'Sin código';
  let unitName = UnitMeasure[unitMeasure as keyof typeof UnitMeasure] || unitMeasure || 'Sin unidad';
  let tributeName = Tribute[tributeId as keyof typeof Tribute] || tributeId || 'Sin tributo';
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">
            {product.name || 'Sin nombre'}
          </h3>
          <Badge variant="outline" className="ml-2">{product.code_reference || '-'}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Precio: </span>
          {product.price}
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Unidad de medida: </span>
          {unitName}
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Tributo: </span>
          {tributeName}
        </p>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 px-6 py-3 flex justify-between">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" /> Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => product._id && onDelete(product._id)}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
} 