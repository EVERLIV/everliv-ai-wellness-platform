
import React from "react";
import { HealthProfileData } from "@/types/healthProfile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LifestyleSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const LifestyleSection: React.FC<LifestyleSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Курение
        </Label>
        <Select value={data.smokingStatus || ''} onValueChange={(value) => onChange({ smokingStatus: value as any })}>
          <SelectTrigger className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none">
            <SelectValue placeholder="Выберите статус курения" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
            <SelectItem value="never">Никогда не курил(а)</SelectItem>
            <SelectItem value="former">Бросил(а) курить</SelectItem>
            <SelectItem value="current_light">Курю редко</SelectItem>
            <SelectItem value="current_moderate">Курю умеренно</SelectItem>
            <SelectItem value="current_heavy">Курю много</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Употребление алкоголя
        </Label>
        <Select value={data.alcoholConsumption || ''} onValueChange={(value) => onChange({ alcoholConsumption: value as any })}>
          <SelectTrigger className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none">
            <SelectValue placeholder="Выберите частоту употребления" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
            <SelectItem value="never">Не употребляю</SelectItem>
            <SelectItem value="rarely">Редко</SelectItem>
            <SelectItem value="occasionally">Иногда</SelectItem>
            <SelectItem value="regularly">Регулярно</SelectItem>
            <SelectItem value="daily">Ежедневно</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="field">
        <Label className="text-base font-medium text-gray-900 mb-2">
          Тип питания
        </Label>
        <Select value={data.dietType || ''} onValueChange={(value) => onChange({ dietType: value as any })}>
          <SelectTrigger className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none">
            <SelectValue placeholder="Выберите тип питания" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
            <SelectItem value="omnivore">Всеядное</SelectItem>
            <SelectItem value="vegetarian">Вегетарианское</SelectItem>
            <SelectItem value="vegan">Веганское</SelectItem>
            <SelectItem value="keto">Кетогенное</SelectItem>
            <SelectItem value="mediterranean">Средиземноморское</SelectItem>
            <SelectItem value="other">Другое</SelectItem>
          </SelectContent>
        </Select>
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
          className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none placeholder:text-gray-400"
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
          className="border-none bg-transparent text-lg font-normal text-gray-900 py-3 border-b-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default LifestyleSection;
