
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";

interface MentalHealthSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const MentalHealthSection: React.FC<MentalHealthSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Уровень стресса (1-10)
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={data.stressLevel || ''}
          onChange={(e) => onChange({ stressLevel: parseInt(e.target.value) || 5 })}
          placeholder="Оцените уровень стресса от 1 до 10"
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-gray-400"
        />
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Уровень тревожности (1-10)
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={data.anxietyLevel || ''}
          onChange={(e) => onChange({ anxietyLevel: parseInt(e.target.value) || 5 })}
          placeholder="Оцените уровень тревожности от 1 до 10"
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-gray-400"
        />
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Изменения настроения
        </label>
        <select 
          value={data.moodChanges || ''} 
          onChange={(e) => onChange({ moodChanges: e.target.value as any })}
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_0_center] bg-no-repeat bg-[length:20px] pr-8"
        >
          <option value="">Выберите частоту изменений настроения</option>
          <option value="stable">Стабильное настроение</option>
          <option value="mild_changes">Легкие изменения</option>
          <option value="moderate_changes">Умеренные изменения</option>
          <option value="significant_changes">Значительные изменения</option>
        </select>
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Поддержка психического здоровья
        </label>
        <select 
          value={data.mentalHealthSupport || ''} 
          onChange={(e) => onChange({ mentalHealthSupport: e.target.value as any })}
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_0_center] bg-no-repeat bg-[length:20px] pr-8"
        >
          <option value="">Выберите тип поддержки</option>
          <option value="none">Не получаю поддержку</option>
          <option value="family_friends">Поддержка семьи и друзей</option>
          <option value="professional">Профессиональная помощь</option>
          <option value="medication">Медикаментозная поддержка</option>
        </select>
      </div>
    </div>
  );
};

export default MentalHealthSection;
