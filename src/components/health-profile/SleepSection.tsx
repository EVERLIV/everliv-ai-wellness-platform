
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface SleepSectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const SleepSection: React.FC<SleepSectionProps> = ({ data, onChange }) => {
  const sleepIssuesOptions = [
    "Бессонница", "Частые пробуждения", "Апноэ сна", "Храп", 
    "Беспокойные ноги", "Кошмары", "Раннее пробуждение", "Другое"
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
      {/* Количество часов сна */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Количество часов сна в сутки</Label>
        <div className="px-3">
          <Slider
            value={[data.sleepHours]}
            onValueChange={(value) => onChange({ sleepHours: value[0] })}
            max={12}
            min={3}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3 часа</span>
            <span className="font-medium">{data.sleepHours} часов</span>
            <span>12 часов</span>
          </div>
        </div>
        <div className="text-xs text-gray-600">
          Рекомендуется: 7-9 часов для взрослых
        </div>
      </div>

      {/* Качество сна */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Качество сна</Label>
        <RadioGroup 
          value={data.sleepQuality} 
          onValueChange={(value) => onChange({ sleepQuality: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excellent" id="excellent" />
            <Label htmlFor="excellent">Отличное (просыпаюсь отдохнувшим)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="good" />
            <Label htmlFor="good">Хорошее (обычно чувствую себя отдохнувшим)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="fair" />
            <Label htmlFor="fair">Удовлетворительное (иногда чувствую усталость)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="poor" />
            <Label htmlFor="poor">Плохое (часто просыпаюсь уставшим)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very_poor" id="very_poor" />
            <Label htmlFor="very_poor">Очень плохое (постоянно чувствую себя невыспавшимся)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Проблемы со сном */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Проблемы со сном (выберите все подходящие)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sleepIssuesOptions.map((issue) => (
            <div key={issue} className="flex items-center space-x-2">
              <Checkbox
                id={issue}
                checked={(data.sleepIssues || []).includes(issue)}
                onCheckedChange={(checked) => handleArrayChange('sleepIssues', issue, checked as boolean)}
              />
              <Label htmlFor={issue} className="text-sm">{issue}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Рекомендации по сну */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-2">Рекомендации по сну</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Ложитесь спать и просыпайтесь в одно время</li>
          <li>• Избегайте кофеина за 6 часов до сна</li>
          <li>• Создайте прохладную, темную и тихую обстановку</li>
          <li>• Избегайте экранов за час до сна</li>
          <li>• Регулярная физическая активность улучшает сон</li>
        </ul>
      </div>
    </div>
  );
};

export default SleepSection;
