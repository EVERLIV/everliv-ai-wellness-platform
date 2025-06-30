
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
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Если поле пустое, устанавливаем undefined, иначе парсим число
    const age = value === '' ? undefined : parseInt(value, 10);
    // Только обновляем если значение валидное или пустое
    if (value === '' || (!isNaN(age!) && age! > 0 && age! <= 150)) {
      onChange({ age: age || 0 });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const height = value === '' ? undefined : parseInt(value, 10);
    if (value === '' || (!isNaN(height!) && height! > 0 && height! <= 300)) {
      onChange({ height: height || 0 });
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const weight = value === '' ? undefined : parseInt(value, 10);
    if (value === '' || (!isNaN(weight!) && weight! > 0 && weight! <= 500)) {
      onChange({ weight: weight || 0 });
    }
  };

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
              value={data.age && data.age > 0 ? data.age : ''}
              onChange={handleAgeChange}
              placeholder="Введите возраст"
              min="1"
              max="150"
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
              value={data.height && data.height > 0 ? data.height : ''}
              onChange={handleHeightChange}
              placeholder="Введите рост в см"
              min="1"
              max="300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Вес (кг)</Label>
            <Input
              id="weight"
              type="number"
              value={data.weight && data.weight > 0 ? data.weight : ''}
              onChange={handleWeightChange}
              placeholder="Введите вес в кг"
              min="1"
              max="500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
