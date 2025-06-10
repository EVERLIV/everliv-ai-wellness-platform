
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface PersonalInfoSectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Возраст */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Возраст</Label>
          <div className="px-3">
            <Slider
              value={[data.age]}
              onValueChange={(value) => onChange({ age: value[0] })}
              max={100}
              min={18}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>18</span>
              <span className="font-medium">{data.age} лет</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Пол */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Пол</Label>
          <RadioGroup 
            value={data.gender} 
            onValueChange={(value) => onChange({ gender: value })}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Мужской</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Женский</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Другой</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Рост */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Рост (см)</Label>
          <div className="px-3">
            <Slider
              value={[data.height]}
              onValueChange={(value) => onChange({ height: value[0] })}
              max={220}
              min={120}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>120 см</span>
              <span className="font-medium">{data.height} см</span>
              <span>220 см</span>
            </div>
          </div>
        </div>

        {/* Вес */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Вес (кг)</Label>
          <div className="px-3">
            <Slider
              value={[data.weight]}
              onValueChange={(value) => onChange({ weight: value[0] })}
              max={200}
              min={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30 кг</span>
              <span className="font-medium">{data.weight} кг</span>
              <span>200 кг</span>
            </div>
          </div>
        </div>
      </div>

      {/* ИМТ калькулятор */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Индекс массы тела (ИМТ)</h4>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            {((data.weight / ((data.height / 100) ** 2)) || 0).toFixed(1)}
          </span>
          <span className="text-sm text-blue-700">
            {(() => {
              const bmi = data.weight / ((data.height / 100) ** 2);
              if (bmi < 18.5) return "Недостаточный вес";
              if (bmi < 25) return "Нормальный вес";
              if (bmi < 30) return "Избыточный вес";
              return "Ожирение";
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
