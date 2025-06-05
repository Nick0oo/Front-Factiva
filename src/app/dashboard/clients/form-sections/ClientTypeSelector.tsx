import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { type ClientData } from '../hooks/useClientData';

interface ClientTypeSelectorProps {
  clientData: ClientData;
  updateOrganizationType: (type: number) => void;
}

export function ClientTypeSelector({ clientData, updateOrganizationType }: ClientTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tipo de Cliente</Label>
      <RadioGroup
        value={clientData.legal_organization_id.toString()}
        onValueChange={(value) => updateOrganizationType(parseInt(value))}
        className="flex flex-row space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id="juridica" />
          <Label htmlFor="juridica">Persona Jurídica</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2" id="natural" />
          <Label htmlFor="natural">Persona Natural</Label>
        </div>
      </RadioGroup>
    </div>
  );
}