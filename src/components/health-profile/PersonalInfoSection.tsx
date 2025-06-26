
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";

interface PersonalInfoSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ data, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Личные данные
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Возраст</Label>
            <Input
              id="age"
              type="number"
              value={data.age}
              onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
              placeholder="Введите возраст"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Пол</Label>
            <Select value={data.gender} onValueChange={(value) => onChange({ gender: value as any })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите пол" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Мужской</SelectItem>
                <SelectItem value="female">Женский</SelectItem>
                <SelectItem value="other">Другой</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Рост (см)</Label>
            <Input
              id="height"
              type="number"
              value={data.height}
              onChange={(e) => onChange({ height: parseInt(e.target.value) || 0 })}
              placeholder="Введите рост в см"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Вес (кг)</Label>
            <Input
              id="weight"
              type="number"
              value={data.weight}
              onChange={(e) => onChange({ weight: parseInt(e.target.value) || 0 })}
              placeholder="Введите вес в кг"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
