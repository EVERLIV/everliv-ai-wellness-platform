
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";

interface PhysicalHealthSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const PhysicalHealthSection: React.FC<PhysicalHealthSectionProps> = ({ data, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Физическое здоровье
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="physicalActivity">Физическая активность</Label>
            <Select 
              value={data.physicalActivity} 
              onValueChange={(value) => onChange({ physicalActivity: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите уровень активности" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Сидячий образ жизни</SelectItem>
                <SelectItem value="light">Легкая активность</SelectItem>
                <SelectItem value="moderate">Умеренная активность</SelectItem>
                <SelectItem value="active">Активный</SelectItem>
                <SelectItem value="very_active">Очень активный</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exerciseFrequency">Тренировки в неделю</Label>
            <Input
              id="exerciseFrequency"
              type="number"
              value={data.exerciseFrequency}
              onChange={(e) => onChange({ exerciseFrequency: parseInt(e.target.value) || 0 })}
              placeholder="Количество тренировок в неделю"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessLevel">Уровень физической подготовки</Label>
            <Select 
              value={data.fitnessLevel} 
              onValueChange={(value) => onChange({ fitnessLevel: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите уровень подготовки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Начинающий</SelectItem>
                <SelectItem value="intermediate">Средний</SelectItem>
                <SelectItem value="advanced">Продвинутый</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhysicalHealthSection;
