
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhysicalHealthSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const PhysicalHealthSection: React.FC<PhysicalHealthSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Физическая активность
        </Label>
        <Select value={data.physicalActivity || ''} onValueChange={(value) => onChange({ physicalActivity: value as any })}>
          <SelectTrigger className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none">
            <SelectValue placeholder="Выберите уровень активности" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
            <SelectItem value="sedentary">Сидячий образ жизни</SelectItem>
            <SelectItem value="light">Легкая активность</SelectItem>
            <SelectItem value="moderate">Умеренная активность</SelectItem>
            <SelectItem value="active">Активный</SelectItem>
            <SelectItem value="very_active">Очень активный</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Тренировки в неделю
        </Label>
        <Input
          type="number"
          value={data.exerciseFrequency || ''}
          onChange={(e) => onChange({ exerciseFrequency: parseInt(e.target.value) || 0 })}
          placeholder="Количество тренировок в неделю"
          className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none placeholder:text-gray-400"
        />
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Уровень физической подготовки
        </Label>
        <Select value={data.fitnessLevel || ''} onValueChange={(value) => onChange({ fitnessLevel: value as any })}>
          <SelectTrigger className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none">
            <SelectValue placeholder="Выберите уровень подготовки" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
            <SelectItem value="beginner">Начинающий</SelectItem>
            <SelectItem value="intermediate">Средний</SelectItem>
            <SelectItem value="advanced">Продвинутый</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PhysicalHealthSection;
