
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LifestyleSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const LifestyleSection: React.FC<LifestyleSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-3">
          Курение
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'never', label: 'Никогда не курил(а)' },
            { value: 'former', label: 'Бросил(а) курить' },
            { value: 'current_light', label: 'Курю редко' },
            { value: 'current_moderate', label: 'Курю умеренно' },
            { value: 'current_heavy', label: 'Курю много' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ smokingStatus: option.value as any })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                data.smokingStatus === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-3">
          Употребление алкоголя
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'never', label: 'Не употребляю' },
            { value: 'rarely', label: 'Редко' },
            { value: 'occasionally', label: 'Иногда' },
            { value: 'regularly', label: 'Регулярно' },
            { value: 'daily', label: 'Ежедневно' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ alcoholConsumption: option.value as any })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                data.alcoholConsumption === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-3">
          Тип питания
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'omnivore', label: 'Всеядное' },
            { value: 'vegetarian', label: 'Вегетарианское' },
            { value: 'vegan', label: 'Веганское' },
            { value: 'keto', label: 'Кетогенное' },
            { value: 'mediterranean', label: 'Средиземноморское' },
            { value: 'other', label: 'Другое' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ dietType: option.value as any })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                data.dietType === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Потребление воды (стаканов в день)
        </Label>
        <Input
          type="number"
          value={data.waterIntake || ''}
          onChange={(e) => onChange({ waterIntake: parseInt(e.target.value) || 0 })}
          placeholder="Количество стаканов воды в день"
          className="bg-gray-50 rounded-lg px-3 py-3 text-lg font-normal text-gray-900 border border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 placeholder:text-gray-400"
        />
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Потребление кофеина (чашек в день)
        </Label>
        <Input
          type="number"
          value={data.caffeineIntake || ''}
          onChange={(e) => onChange({ caffeineIntake: parseInt(e.target.value) || 0 })}
          placeholder="Количество чашек кофе в день"
          className="bg-gray-50 rounded-lg px-3 py-3 text-lg font-normal text-gray-900 border border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default LifestyleSection;
