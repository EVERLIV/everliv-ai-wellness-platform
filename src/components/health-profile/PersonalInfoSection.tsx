
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfoSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ data, onChange }) => {
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const age = value === '' ? undefined : parseInt(value, 10);
    if (value === '' || (!isNaN(age!) && age! > 0 && age! <= 150)) {
      onChange({ age: age || 0 });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const height = value === '' ? undefined : parseInt(value, 10);
    if (value === '' || (!isNaN(height!) && height! > 0 && height! <= 300)) {
      onChange({ height: height || 0 });
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const weight = value === '' ? undefined : parseInt(value, 10);
    if (value === '' || (!isNaN(weight!) && weight! > 0 && weight! <= 500)) {
      onChange({ weight: weight || 0 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Возраст
        </label>
        <input
          type="number"
          value={data.age && data.age > 0 ? data.age : ''}
          onChange={handleAgeChange}
          placeholder="Введите возраст"
          min="1"
          max="150"
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-gray-400"
        />
      </div>

        <div className="field">
          <label className="block text-base font-medium text-gray-900 mb-2">
            Пол
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'male', label: 'Мужской' },
              { value: 'female', label: 'Женский' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ gender: option.value as any })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  data.gender === option.value
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
        <label className="block text-base font-medium text-gray-900 mb-2">
          Рост (см)
        </label>
        <input
          type="number"
          value={data.height && data.height > 0 ? data.height : ''}
          onChange={handleHeightChange}
          placeholder="Введите рост в см"
          min="1"
          max="300"
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-gray-400"
        />
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Вес (кг)
        </label>
        <input
          type="number"
          value={data.weight && data.weight > 0 ? data.weight : ''}
          onChange={handleWeightChange}
          placeholder="Введите вес в кг"
          min="1"
          max="500"
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
