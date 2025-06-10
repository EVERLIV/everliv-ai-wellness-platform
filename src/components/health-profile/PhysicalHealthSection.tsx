
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface PhysicalHealthSectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const PhysicalHealthSection: React.FC<PhysicalHealthSectionProps> = ({ data, onChange }) => {
  const chronicConditionsOptions = [
    "Гипертония", "Диабет", "Астма", "Артрит", "Остеопороз", 
    "Сердечно-сосудистые заболевания", "Заболевания щитовидной железы", "Другое"
  ];

  const symptomsOptions = [
    "Усталость", "Головные боли", "Боли в суставах", "Боли в спине",
    "Одышка", "Головокружение", "Проблемы с пищеварением", "Другое"
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
      {/* Уровень физической активности */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Уровень физической активности</Label>
        <RadioGroup 
          value={data.physicalActivity} 
          onValueChange={(value) => onChange({ physicalActivity: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sedentary" id="sedentary" />
            <Label htmlFor="sedentary">Малоподвижный (сидячая работа, минимум упражнений)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Легкая активность (легкие упражнения 1-3 дня в неделю)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="moderate" />
            <Label htmlFor="moderate">Умеренная активность (упражнения 3-5 дней в неделю)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high">Высокая активность (интенсивные упражнения 6-7 дней в неделю)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very_high" id="very_high" />
            <Label htmlFor="very_high">Очень высокая (2 тренировки в день, тяжелая физическая работа)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Частота упражнений */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Частота упражнений (дней в неделю)</Label>
        <div className="px-3">
          <Slider
            value={[data.exerciseFrequency]}
            onValueChange={(value) => onChange({ exerciseFrequency: value[0] })}
            max={7}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 дней</span>
            <span className="font-medium">{data.exerciseFrequency} дней</span>
            <span>7 дней</span>
          </div>
        </div>
      </div>

      {/* Уровень физической подготовки */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Уровень физической подготовки</Label>
        <RadioGroup 
          value={data.fitnessLevel} 
          onValueChange={(value) => onChange({ fitnessLevel: value })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner">Начинающий</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate">Средний</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced">Продвинутый</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="athlete" id="athlete" />
            <Label htmlFor="athlete">Спортсмен</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Хронические заболевания */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Хронические заболевания (выберите все подходящие)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chronicConditionsOptions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={(data.chronicConditions || []).includes(condition)}
                onCheckedChange={(checked) => handleArrayChange('chronicConditions', condition, checked as boolean)}
              />
              <Label htmlFor={condition} className="text-sm">{condition}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Текущие симптомы */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Текущие симптомы (выберите все подходящие)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {symptomsOptions.map((symptom) => (
            <div key={symptom} className="flex items-center space-x-2">
              <Checkbox
                id={symptom}
                checked={(data.currentSymptoms || []).includes(symptom)}
                onCheckedChange={(checked) => handleArrayChange('currentSymptoms', symptom, checked as boolean)}
              />
              <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhysicalHealthSection;
