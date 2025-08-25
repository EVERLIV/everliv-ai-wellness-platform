
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhysicalHealthSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const PhysicalHealthSection: React.FC<PhysicalHealthSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-3">
          Физическая активность
        </Label>
        <p className="text-sm text-gray-600 mb-3">Оцените ваш уровень активности</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'sedentary', label: 'Сидячий' },
            { value: 'light', label: 'Легкая активность' },
            { value: 'moderate', label: 'Умеренная' },
            { value: 'active', label: 'Активный' },
            { value: 'very_active', label: 'Очень активный' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ physicalActivity: option.value as any })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                data.physicalActivity === option.value
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
          Частота тренировок
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 0, label: 'Никогда' },
            { value: 2, label: '1-2 раз/нед' },
            { value: 4, label: '3-4 раз/нед' },
            { value: 6, label: '5+ раз/нед' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ exerciseFrequency: option.value })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                data.exerciseFrequency === option.value
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
          Уровень физической подготовки
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'beginner', label: 'Начинающий' },
            { value: 'intermediate', label: 'Средний' },
            { value: 'advanced', label: 'Продвинутый' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ fitnessLevel: option.value as any })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                data.fitnessLevel === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhysicalHealthSection;
