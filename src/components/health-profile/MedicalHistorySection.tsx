
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface MedicalHistorySectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ data, onChange }) => {
  const familyHistoryOptions = [
    "Сердечно-сосудистые заболевания", "Диабет", "Рак", "Гипертония", 
    "Инсульт", "Заболевания щитовидной железы", "Психические расстройства", 
    "Остеопороз", "Астма", "Аллергии", "Другое"
  ];

  const allergyOptions = [
    "Пищевые аллергии", "Пыльца", "Пыль", "Шерсть животных", 
    "Лекарственные препараты", "Латекс", "Химические вещества", "Другое"
  ];

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    const currentArray = data[field] || [];
    if (checked) {
      onChange({ [field]: [...currentArray, value] });
    } else {
      onChange({ [field]: currentArray.filter((item: string) => item !== value) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Семейная история */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Семейная история заболеваний (выберите все подходящие)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {familyHistoryOptions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={(data.familyHistory || []).includes(condition)}
                onCheckedChange={(checked) => handleArrayChange('familyHistory', condition, checked as boolean)}
              />
              <Label htmlFor={condition} className="text-sm">{condition}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Аллергии */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Аллергии (выберите все подходящие)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allergyOptions.map((allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={allergy}
                checked={(data.allergies || []).includes(allergy)}
                onCheckedChange={(checked) => handleArrayChange('allergies', allergy, checked as boolean)}
              />
              <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Текущие лекарства */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Текущие лекарства и добавки</Label>
        <Textarea
          placeholder="Перечислите все лекарства, витамины и добавки, которые вы принимаете..."
          value={(data.medications || []).join('\n')}
          onChange={(e) => onChange({ medications: e.target.value.split('\n').filter(Boolean) })}
          className="min-h-[100px]"
        />
        <div className="text-xs text-gray-600">
          Укажите название, дозировку и частоту приема каждого препарата
        </div>
      </div>

      {/* Перенесенные операции */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Перенесенные операции</Label>
        <Textarea
          placeholder="Перечислите все операции и их даты..."
          value={(data.previousSurgeries || []).join('\n')}
          onChange={(e) => onChange({ previousSurgeries: e.target.value.split('\n').filter(Boolean) })}
          className="min-h-[80px]"
        />
      </div>

      {/* Последний медосмотр */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Последний полный медицинский осмотр</Label>
        <RadioGroup 
          value={data.lastCheckup} 
          onValueChange={(value) => onChange({ lastCheckup: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="less_than_6_months" id="less_than_6_months" />
            <Label htmlFor="less_than_6_months">Менее 6 месяцев назад</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6_to_12_months" id="6_to_12_months" />
            <Label htmlFor="6_to_12_months">6-12 месяцев назад</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1_to_2_years" id="1_to_2_years" />
            <Label htmlFor="1_to_2_years">1-2 года назад</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2_to_5_years" id="2_to_5_years" />
            <Label htmlFor="2_to_5_years">2-5 лет назад</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="more_than_5_years" id="more_than_5_years" />
            <Label htmlFor="more_than_5_years">Более 5 лет назад</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="checkup_never" />
            <Label htmlFor="checkup_never">Никогда не проходил(а)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Важная информация */}
      <div className="bg-red-50 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-2">Важно!</h4>
        <p className="text-sm text-red-700">
          Эта информация будет использована только для предоставления персонализированных 
          рекомендаций и не заменяет консультацию с врачом. При серьезных проблемах со здоровьем 
          обязательно обратитесь к медицинскому специалисту.
        </p>
      </div>
    </div>
  );
};

export default MedicalHistorySection;
