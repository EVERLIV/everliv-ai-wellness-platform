
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface MentalHealthSectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const MentalHealthSection: React.FC<MentalHealthSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Уровень стресса */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Уровень стресса (1-10)</Label>
        <div className="px-3">
          <Slider
            value={[data.stressLevel]}
            onValueChange={(value) => onChange({ stressLevel: value[0] })}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Очень низкий</span>
            <span className="font-medium">{data.stressLevel}/10</span>
            <span>Очень высокий</span>
          </div>
        </div>
        <div className="text-xs text-gray-600">
          1-3: Низкий стресс | 4-6: Умеренный стресс | 7-10: Высокий стресс
        </div>
      </div>

      {/* Уровень тревожности */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Уровень тревожности (1-10)</Label>
        <div className="px-3">
          <Slider
            value={[data.anxietyLevel]}
            onValueChange={(value) => onChange({ anxietyLevel: value[0] })}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Очень низкая</span>
            <span className="font-medium">{data.anxietyLevel}/10</span>
            <span>Очень высокая</span>
          </div>
        </div>
      </div>

      {/* Изменения настроения */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Изменения настроения</Label>
        <RadioGroup 
          value={data.moodChanges} 
          onValueChange={(value) => onChange({ moodChanges: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stable" id="stable" />
            <Label htmlFor="stable">Стабильное настроение</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="minor_fluctuations" id="minor_fluctuations" />
            <Label htmlFor="minor_fluctuations">Незначительные колебания</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate_fluctuations" id="moderate_fluctuations" />
            <Label htmlFor="moderate_fluctuations">Умеренные колебания</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="significant_fluctuations" id="significant_fluctuations" />
            <Label htmlFor="significant_fluctuations">Значительные колебания</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe_fluctuations" id="severe_fluctuations" />
            <Label htmlFor="severe_fluctuations">Серьезные нарушения настроения</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Поддержка психического здоровья */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Поддержка психического здоровья</Label>
        <RadioGroup 
          value={data.mentalHealthSupport} 
          onValueChange={(value) => onChange({ mentalHealthSupport: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">Не получаю поддержку</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="family_friends" id="family_friends" />
            <Label htmlFor="family_friends">Поддержка семьи и друзей</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="therapy" id="therapy" />
            <Label htmlFor="therapy">Психотерапия</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medication" id="medication" />
            <Label htmlFor="medication">Медикаментозное лечение</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Терапия и медикаменты</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="support_groups" id="support_groups" />
            <Label htmlFor="support_groups">Группы поддержки</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default MentalHealthSection;
