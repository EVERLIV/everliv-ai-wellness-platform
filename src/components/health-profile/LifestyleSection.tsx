
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";

interface LifestyleSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const LifestyleSection: React.FC<LifestyleSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Курение
        </label>
        <select 
          value={data.smokingStatus || ''} 
          onChange={(e) => onChange({ smokingStatus: e.target.value as any })}
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_0_center] bg-no-repeat bg-[length:20px] pr-8"
        >
          <option value="">Выберите статус курения</option>
          <option value="never">Никогда не курил(а)</option>
          <option value="former">Бросил(а) курить</option>
          <option value="current_light">Курю редко</option>
          <option value="current_moderate">Курю умеренно</option>
          <option value="current_heavy">Курю много</option>
        </select>
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Употребление алкоголя
        </label>
        <select 
          value={data.alcoholConsumption || ''} 
          onChange={(e) => onChange({ alcoholConsumption: e.target.value as any })}
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_0_center] bg-no-repeat bg-[length:20px] pr-8"
        >
          <option value="">Выберите частоту употребления</option>
          <option value="never">Не употребляю</option>
          <option value="rarely">Редко</option>
          <option value="occasionally">Иногда</option>
          <option value="regularly">Регулярно</option>
          <option value="daily">Ежедневно</option>
        </select>
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Тип питания
        </label>
        <select 
          value={data.dietType || ''} 
          onChange={(e) => onChange({ dietType: e.target.value as any })}
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e')] bg-[right_0_center] bg-no-repeat bg-[length:20px] pr-8"
        >
          <option value="">Выберите тип питания</option>
          <option value="omnivore">Всеядное</option>
          <option value="vegetarian">Вегетарианское</option>
          <option value="vegan">Веганское</option>
          <option value="keto">Кетогенное</option>
          <option value="mediterranean">Средиземноморское</option>
          <option value="other">Другое</option>
        </select>
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Потребление воды (стаканов в день)
        </label>
        <input
          type="number"
          value={data.waterIntake || ''}
          onChange={(e) => onChange({ waterIntake: parseInt(e.target.value) || 0 })}
          placeholder="Количество стаканов воды в день"
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-gray-400"
        />
      </div>

      <div className="field">
        <label className="block text-base font-medium text-gray-900 mb-2">
          Потребление кофеина (чашек в день)
        </label>
        <input
          type="number"
          value={data.caffeineIntake || ''}
          onChange={(e) => onChange({ caffeineIntake: parseInt(e.target.value) || 0 })}
          placeholder="Количество чашек кофе в день"
          className="w-full border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default LifestyleSection;
