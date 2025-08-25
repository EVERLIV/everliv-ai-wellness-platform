
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MentalHealthSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const MentalHealthSection: React.FC<MentalHealthSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Уровень стресса (1-10)
        </Label>
        <Input
          type="number"
          min="1"
          max="10"
          value={data.stressLevel || ''}
          onChange={(e) => onChange({ stressLevel: parseInt(e.target.value) || 5 })}
          placeholder="Оцените уровень стресса от 1 до 10"
          className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none placeholder:text-gray-400"
        />
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Уровень тревожности (1-10)
        </Label>
        <Input
          type="number"
          min="1"
          max="10"
          value={data.anxietyLevel || ''}
          onChange={(e) => onChange({ anxietyLevel: parseInt(e.target.value) || 5 })}
          placeholder="Оцените уровень тревожности от 1 до 10"
          className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none placeholder:text-gray-400"
        />
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-3">
          Изменения настроения
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'stable', label: 'Стабильное настроение' },
            { value: 'mild_changes', label: 'Легкие изменения' },
            { value: 'moderate_changes', label: 'Умеренные изменения' },
            { value: 'significant_changes', label: 'Значительные изменения' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ moodChanges: option.value as any })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                data.moodChanges === option.value
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
          Поддержка психического здоровья
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'none', label: 'Не получаю поддержку' },
            { value: 'family_friends', label: 'Поддержка семьи и друзей' },
            { value: 'professional', label: 'Профессиональная помощь' },
            { value: 'medication', label: 'Медикаментозная поддержка' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ mentalHealthSupport: option.value as any })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                data.mentalHealthSupport === option.value
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

export default MentalHealthSection;
