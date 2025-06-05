import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { type ClientData } from '../hooks/useClientData';

interface TaxInfoSectionProps {
  clientData: ClientData;
  updateTaxType: (type: number) => void;
}

export function TaxInfoSection({ clientData, updateTaxType }: TaxInfoSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Régimen de IVA</Label>
      <Select 
        value={clientData.tribute_id.toString()}
        onValueChange={(value) => updateTaxType(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccione régimen de IVA" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="18">Responsable de IVA</SelectItem>
          <SelectItem value="21">No responsable de IVA</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}