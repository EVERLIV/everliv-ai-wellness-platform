
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthProfileData } from "@/types/healthProfile";

interface LifestyleSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const LifestyleSection: React.FC<LifestyleSectionProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="smokingStatus">Курение</Label>
        <Select 
          value={data.smokingStatus} 
          onValueChange={(value) => onChange({ smokingStatus: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите статус курения" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="never">Никогда не курил(а)</SelectItem>
            <SelectItem value="former">Бросил(а) курить</SelectItem>
            <SelectItem value="current">Курю в настоящее время</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alcoholConsumption">Употребление алкоголя</Label>
        <Select 
          value={data.alcoholConsumption} 
          onValueChange={(value) => onChange({ alcoholConsumption: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите частоту употребления" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="never">Не употребляю</SelectItem>
            <SelectItem value="rarely">Редко</SelectItem>
            <SelectItem value="occasionally">Иногда</SelectItem>
            <SelectItem value="regularly">Регулярно</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietType">Тип питания</Label>
        <Select 
          value={data.dietType} 
          onValueChange={(value) => onChange({ dietType: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите тип питания" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="omnivore">Всеядное</SelectItem>
            <SelectItem value="vegetarian">Вегетарианское</SelectItem>
            <SelectItem value="vegan">Веганское</SelectItem>
            <SelectItem value="keto">Кетогенное</SelectItem>
            <SelectItem value="mediterranean">Средиземноморское</SelectItem>
            <SelectItem value="other">Другое</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="waterIntake">Потребление воды (стаканов в день)</Label>
        <Input
          id="waterIntake"
          type="number"
          value={data.waterIntake}
          onChange={(e) => onChange({ waterIntake: parseInt(e.target.value) || 0 })}
          placeholder="Количество стаканов воды в день"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="caffeineIntake">Потребление кофеина (чашек в день)</Label>
        <Input
          id="caffeineIntake"
          type="number"
          value={data.caffeineIntake}
          onChange={(e) => onChange({ caffeineIntake: parseInt(e.target.value) || 0 })}
          placeholder="Количество чашек кофе в день"
        />
      </div>
    </div>
  );
};

export default LifestyleSection;
