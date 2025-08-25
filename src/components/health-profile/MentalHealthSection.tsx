
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <Label className="text-base font-medium text-gray-900 mb-2">
          Изменения настроения
        </Label>
        <Select value={data.moodChanges || ''} onValueChange={(value) => onChange({ moodChanges: value as any })}>
          <SelectTrigger className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none">
            <SelectValue placeholder="Выберите частоту изменений настроения" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
            <SelectItem value="stable">Стабильное настроение</SelectItem>
            <SelectItem value="mild_changes">Легкие изменения</SelectItem>
            <SelectItem value="moderate_changes">Умеренные изменения</SelectItem>
            <SelectItem value="significant_changes">Значительные изменения</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Поддержка психического здоровья
        </Label>
        <Select value={data.mentalHealthSupport || ''} onValueChange={(value) => onChange({ mentalHealthSupport: value as any })}>
          <SelectTrigger className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none">
            <SelectValue placeholder="Выберите тип поддержки" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
            <SelectItem value="none">Не получаю поддержку</SelectItem>
            <SelectItem value="family_friends">Поддержка семьи и друзей</SelectItem>
            <SelectItem value="professional">Профессиональная помощь</SelectItem>
            <SelectItem value="medication">Медикаментозная поддержка</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MentalHealthSection;
