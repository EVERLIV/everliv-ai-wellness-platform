
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthProfileData } from "@/types/healthProfile";

interface MentalHealthSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const MentalHealthSection: React.FC<MentalHealthSectionProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="stressLevel">Уровень стресса (1-10)</Label>
        <Input
          id="stressLevel"
          type="number"
          min="1"
          max="10"
          value={data.stressLevel}
          onChange={(e) => onChange({ stressLevel: parseInt(e.target.value) || 5 })}
          placeholder="Оцените уровень стресса от 1 до 10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="anxietyLevel">Уровень тревожности (1-10)</Label>
        <Input
          id="anxietyLevel"
          type="number"
          min="1"
          max="10"
          value={data.anxietyLevel}
          onChange={(e) => onChange({ anxietyLevel: parseInt(e.target.value) || 5 })}
          placeholder="Оцените уровень тревожности от 1 до 10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="moodChanges">Изменения настроения</Label>
        <Select 
          value={data.moodChanges} 
          onValueChange={(value) => onChange({ moodChanges: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите частоту изменений настроения" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stable">Стабильное настроение</SelectItem>
            <SelectItem value="occasional">Иногда</SelectItem>
            <SelectItem value="frequent">Часто</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mentalHealthSupport">Поддержка психического здоровья</Label>
        <Select 
          value={data.mentalHealthSupport} 
          onValueChange={(value) => onChange({ mentalHealthSupport: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите тип поддержки" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Не получаю поддержку</SelectItem>
            <SelectItem value="family_friends">Поддержка семьи и друзей</SelectItem>
            <SelectItem value="professional">Профессиональная помощь</SelectItem>
            <SelectItem value="both">Оба варианта</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MentalHealthSection;
