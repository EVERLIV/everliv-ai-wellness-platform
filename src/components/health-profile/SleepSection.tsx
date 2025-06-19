
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthProfileData } from "@/types/healthProfile";

interface SleepSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const SleepSection: React.FC<SleepSectionProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="sleepHours">Часы сна</Label>
        <Input
          id="sleepHours"
          type="number"
          value={data.sleepHours}
          onChange={(e) => onChange({ sleepHours: parseInt(e.target.value) || 0 })}
          placeholder="Количество часов сна"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sleepQuality">Качество сна</Label>
        <Select 
          value={data.sleepQuality} 
          onValueChange={(value) => onChange({ sleepQuality: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите качество сна" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="poor">Плохое</SelectItem>
            <SelectItem value="fair">Удовлетворительное</SelectItem>
            <SelectItem value="good">Хорошее</SelectItem>
            <SelectItem value="excellent">Отличное</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SleepSection;
