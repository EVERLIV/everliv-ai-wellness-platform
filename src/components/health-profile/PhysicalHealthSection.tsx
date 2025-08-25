
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";

interface PhysicalHealthSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const PhysicalHealthSection: React.FC<PhysicalHealthSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Физическая активность
        </label>
        <select 
          value={data.physicalActivity || ''} 
          onChange={(e) => onChange({ physicalActivity: e.target.value as any })}
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_0_center] bg-no-repeat bg-[length:20px] pr-8"
        >
          <option value="">Выберите уровень активности</option>
          <option value="sedentary">Сидячий образ жизни</option>
          <option value="light">Легкая активность</option>
          <option value="moderate">Умеренная активность</option>
          <option value="active">Активный</option>
          <option value="very_active">Очень активный</option>
        </select>
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Тренировки в неделю
        </label>
        <input
          type="number"
          value={data.exerciseFrequency || ''}
          onChange={(e) => onChange({ exerciseFrequency: parseInt(e.target.value) || 0 })}
          placeholder="Количество тренировок в неделю"
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-gray-400"
        />
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Уровень физической подготовки
        </label>
        <select 
          value={data.fitnessLevel || ''} 
          onChange={(e) => onChange({ fitnessLevel: e.target.value as any })}
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_0_center] bg-no-repeat bg-[length:20px] pr-8"
        >
          <option value="">Выберите уровень подготовки</option>
          <option value="beginner">Начинающий</option>
          <option value="intermediate">Средний</option>
          <option value="advanced">Продвинутый</option>
        </select>
      </div>
    </div>
  );
};

export default PhysicalHealthSection;
