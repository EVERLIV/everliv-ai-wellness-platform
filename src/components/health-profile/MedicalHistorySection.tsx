
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface MedicalHistorySectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ data, onChange }) => {
  const handleFamilyHistoryChange = (condition: string, checked: boolean) => {
    const currentHistory = data.familyHistory || [];
    let newHistory;
    
    if (checked) {
      newHistory = [...currentHistory, condition];
    } else {
      newHistory = currentHistory.filter((h: string) => h !== condition);
    }
    
    onChange({ familyHistory: newHistory });
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    const currentAllergies = data.allergies || [];
    let newAllergies;
    
    if (checked) {
      newAllergies = [...currentAllergies, allergy];
    } else {
      newAllergies = currentAllergies.filter((a: string) => a !== allergy);
    }
    
    onChange({ allergies: newAllergies });
  };

  const handleMedicationChange = (medication: string, checked: boolean) => {
    const currentMedications = data.medications || [];
    let newMedications;
    
    if (checked) {
      newMedications = [...currentMedications, medication];
    } else {
      newMedications = currentMedications.filter((m: string) => m !== medication);
    }
    
    onChange({ medications: newMedications });
  };

  const handleSurgeryChange = (surgery: string, checked: boolean) => {
    const currentSurgeries = data.previousSurgeries || [];
    let newSurgeries;
    
    if (checked) {
      newSurgeries = [...currentSurgeries, surgery];
    } else {
      newSurgeries = currentSurgeries.filter((s: string) => s !== surgery);
    }
    
    onChange({ previousSurgeries: newSurgeries });
  };

  return (
    <div className="space-y-6">
      {/* Семейная история */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Семейная история заболеваний</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Сердечно-сосудистые заболевания',
            'Диабет',
            'Рак',
            'Гипертония',
            'Остеопороз',
            'Психические заболевания',
            'Аутоиммунные заболевания'
          ].map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={(data.familyHistory || []).includes(condition)}
                onCheckedChange={(checked) => handleFamilyHistoryChange(condition, !!checked)}
              />
              <Label htmlFor={condition}>{condition}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other_family_history"
              checked={(data.familyHistory || []).includes('other')}
              onCheckedChange={(checked) => handleFamilyHistoryChange('other', !!checked)}
            />
            <Label htmlFor="other_family_history">Другое</Label>
          </div>
        </div>
        
        {(data.familyHistory || []).includes('other') && (
          <div className="mt-3">
            <Input
              placeholder="Укажите другие заболевания в семейной истории"
              value={data.familyHistoryOther || ''}
              onChange={(e) => onChange({ familyHistoryOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Аллергии */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Аллергии</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Пищевые аллергии',
            'Лекарственные аллергии',
            'Пыльца',
            'Пылевые клещи',
            'Животные',
            'Латекс',
            'Насекомые'
          ].map((allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={allergy}
                checked={(data.allergies || []).includes(allergy)}
                onCheckedChange={(checked) => handleAllergyChange(allergy, !!checked)}
              />
              <Label htmlFor={allergy}>{allergy}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other_allergy"
              checked={(data.allergies || []).includes('other')}
              onCheckedChange={(checked) => handleAllergyChange('other', !!checked)}
            />
            <Label htmlFor="other_allergy">Другое</Label>
          </div>
        </div>
        
        {(data.allergies || []).includes('other') && (
          <div className="mt-3">
            <Input
              placeholder="Укажите другие аллергии"
              value={data.allergiesOther || ''}
              onChange={(e) => onChange({ allergiesOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Принимаемые медикаменты */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Принимаемые медикаменты</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Обезболивающие',
            'Антибиотики',
            'Витамины',
            'Антидепрессанты',
            'Препараты для сердца',
            'Препараты от давления',
            'Гормональные препараты'
          ].map((medication) => (
            <div key={medication} className="flex items-center space-x-2">
              <Checkbox
                id={medication}
                checked={(data.medications || []).includes(medication)}
                onCheckedChange={(checked) => handleMedicationChange(medication, !!checked)}
              />
              <Label htmlFor={medication}>{medication}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other_medication"
              checked={(data.medications || []).includes('other')}
              onCheckedChange={(checked) => handleMedicationChange('other', !!checked)}
            />
            <Label htmlFor="other_medication">Другое</Label>
          </div>
        </div>
        
        {(data.medications || []).includes('other') && (
          <div className="mt-3">
            <Input
              placeholder="Укажите другие принимаемые медикаменты"
              value={data.medicationsOther || ''}
              onChange={(e) => onChange({ medicationsOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Предыдущие операции */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Предыдущие операции</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Аппендэктомия',
            'Операции на сердце',
            'Ортопедические операции',
            'Гинекологические операции',
            'Операции на желудочно-кишечном тракте',
            'Нейрохирургические операции'
          ].map((surgery) => (
            <div key={surgery} className="flex items-center space-x-2">
              <Checkbox
                id={surgery}
                checked={(data.previousSurgeries || []).includes(surgery)}
                onCheckedChange={(checked) => handleSurgeryChange(surgery, !!checked)}
              />
              <Label htmlFor={surgery}>{surgery}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other_surgery"
              checked={(data.previousSurgeries || []).includes('other')}
              onCheckedChange={(checked) => handleSurgeryChange('other', !!checked)}
            />
            <Label htmlFor="other_surgery">Другое</Label>
          </div>
        </div>
        
        {(data.previousSurgeries || []).includes('other') && (
          <div className="mt-3">
            <Input
              placeholder="Укажите другие операции"
              value={data.previousSurgeriesOther || ''}
              onChange={(e) => onChange({ previousSurgeriesOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Последний медосмотр */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Дата последнего медицинского осмотра</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.lastCheckup ? format(new Date(data.lastCheckup), "dd MMMM yyyy", { locale: ru }) : "Выберите дату"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={data.lastCheckup ? new Date(data.lastCheckup) : undefined}
              onSelect={(date) => onChange({ lastCheckup: date ? date.toISOString().split('T')[0] : '' })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MedicalHistorySection;
