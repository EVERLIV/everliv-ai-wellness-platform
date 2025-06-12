
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface PhysicalHealthSectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const PhysicalHealthSection: React.FC<PhysicalHealthSectionProps> = ({ data, onChange }) => {
  const handleConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = data.chronicConditions || [];
    let newConditions;
    
    if (checked) {
      newConditions = [...currentConditions, condition];
    } else {
      newConditions = currentConditions.filter((c: string) => c !== condition);
    }
    
    onChange({ chronicConditions: newConditions });
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    const currentSymptoms = data.currentSymptoms || [];
    let newSymptoms;
    
    if (checked) {
      newSymptoms = [...currentSymptoms, symptom];
    } else {
      newSymptoms = currentSymptoms.filter((s: string) => s !== symptom);
    }
    
    onChange({ currentSymptoms: newSymptoms });
  };

  return (
    <div className="space-y-6">
      {/* Физическая активность */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Физическая активность</Label>
        <RadioGroup 
          value={data.physicalActivity} 
          onValueChange={(value) => onChange({ physicalActivity: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sedentary" id="sedentary" />
            <Label htmlFor="sedentary">Малоподвижный образ жизни</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Легкая активность (1-2 раза в неделю)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="moderate" />
            <Label htmlFor="moderate">Умеренная активность (3-4 раза в неделю)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active">Активный образ жизни (5-6 раз в неделю)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very_active" id="very_active" />
            <Label htmlFor="very_active">Очень активный (ежедневно)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other_activity" />
            <Label htmlFor="other_activity">Другое</Label>
          </div>
        </RadioGroup>
        
        {data.physicalActivity === 'other' && (
          <div className="mt-3">
            <Input
              placeholder="Опишите вашу физическую активность"
              value={data.physicalActivityOther || ''}
              onChange={(e) => onChange({ physicalActivityOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Частота упражнений */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Частота упражнений (раз в неделю)</Label>
        <div className="px-3">
          <Slider
            value={[data.exerciseFrequency]}
            onValueChange={(value) => onChange({ exerciseFrequency: value[0] })}
            max={14}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className="font-medium">{data.exerciseFrequency} раз</span>
            <span>14+</span>
          </div>
        </div>
      </div>

      {/* Уровень физической подготовки */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Уровень физической подготовки</Label>
        <RadioGroup 
          value={data.fitnessLevel} 
          onValueChange={(value) => onChange({ fitnessLevel: value })}
          className="grid grid-cols-1 gap-3"
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
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other_fitness" />
            <Label htmlFor="other_fitness">Другое</Label>
          </div>
        </RadioGroup>
        
        {data.fitnessLevel === 'other' && (
          <div className="mt-3">
            <Input
              placeholder="Опишите ваш уровень подготовки"
              value={data.fitnessLevelOther || ''}
              onChange={(e) => onChange({ fitnessLevelOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Хронические заболевания */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Хронические заболевания</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Гипертония',
            'Диабет',
            'Сердечно-сосудистые заболевания',
            'Астма',
            'Артрит',
            'Остеопороз'
          ].map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={(data.chronicConditions || []).includes(condition)}
                onCheckedChange={(checked) => handleConditionChange(condition, !!checked)}
              />
              <Label htmlFor={condition}>{condition}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other_condition"
              checked={(data.chronicConditions || []).includes('other')}
              onCheckedChange={(checked) => handleConditionChange('other', !!checked)}
            />
            <Label htmlFor="other_condition">Другое</Label>
          </div>
        </div>
        
        {(data.chronicConditions || []).includes('other') && (
          <div className="mt-3">
            <Input
              placeholder="Укажите другие хронические заболевания"
              value={data.chronicConditionsOther || ''}
              onChange={(e) => onChange({ chronicConditionsOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Текущие симптомы */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Текущие симптомы</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Усталость',
            'Головные боли',
            'Боли в спине',
            'Бессонница',
            'Одышка',
            'Тошнота'
          ].map((symptom) => (
            <div key={symptom} className="flex items-center space-x-2">
              <Checkbox
                id={symptom}
                checked={(data.currentSymptoms || []).includes(symptom)}
                onCheckedChange={(checked) => handleSymptomChange(symptom, !!checked)}
              />
              <Label htmlFor={symptom}>{symptom}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other_symptom"
              checked={(data.currentSymptoms || []).includes('other')}
              onCheckedChange={(checked) => handleSymptomChange('other', !!checked)}
            />
            <Label htmlFor="other_symptom">Другое</Label>
          </div>
        </div>
        
        {(data.currentSymptoms || []).includes('other') && (
          <div className="mt-3">
            <Input
              placeholder="Укажите другие симптомы"
              value={data.currentSymptomsOther || ''}
              onChange={(e) => onChange({ currentSymptomsOther: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysicalHealthSection;
