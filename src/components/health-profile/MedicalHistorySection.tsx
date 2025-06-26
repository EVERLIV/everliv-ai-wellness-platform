
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { HealthProfileData } from "@/types/healthProfile";

interface MedicalHistorySectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Медицинская история
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
          </div>
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
          </div>
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
      </CardContent>
    </Card>
  );
};

export default MedicalHistorySection;
