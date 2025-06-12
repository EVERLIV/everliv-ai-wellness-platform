
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface LifestyleSectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const LifestyleSection: React.FC<LifestyleSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Курение */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Курение</Label>
        <RadioGroup 
          value={data.smokingStatus} 
          onValueChange={(value) => onChange({ smokingStatus: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="never_smoke" />
            <Label htmlFor="never_smoke">Никогда не курил(а)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="former" id="former_smoke" />
            <Label htmlFor="former_smoke">Бросил(а) курить</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="occasional" id="occasional_smoke" />
            <Label htmlFor="occasional_smoke">Курю изредка</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="regular" id="regular_smoke" />
            <Label htmlFor="regular_smoke">Курю регулярно</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other_smoke" />
            <Label htmlFor="other_smoke">Другое</Label>
          </div>
        </RadioGroup>
        
        {data.smokingStatus === 'other' && (
          <div className="mt-3">
            <Input
              placeholder="Опишите ваши привычки курения"
              value={data.smokingStatusOther || ''}
              onChange={(e) => onChange({ smokingStatusOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Алкоголь */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Употребление алкоголя</Label>
        <RadioGroup 
          value={data.alcoholConsumption} 
          onValueChange={(value) => onChange({ alcoholConsumption: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="never_alcohol" />
            <Label htmlFor="never_alcohol">Не употребляю</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rarely" id="rarely_alcohol" />
            <Label htmlFor="rarely_alcohol">Редко (несколько раз в год)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="occasionally" id="occasionally_alcohol" />
            <Label htmlFor="occasionally_alcohol">Иногда (несколько раз в месяц)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly_alcohol" />
            <Label htmlFor="weekly_alcohol">Еженедельно</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily_alcohol" />
            <Label htmlFor="daily_alcohol">Ежедневно</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other_alcohol" />
            <Label htmlFor="other_alcohol">Другое</Label>
          </div>
        </RadioGroup>
        
        {data.alcoholConsumption === 'other' && (
          <div className="mt-3">
            <Input
              placeholder="Опишите ваше употребление алкоголя"
              value={data.alcoholConsumptionOther || ''}
              onChange={(e) => onChange({ alcoholConsumptionOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Тип питания */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Тип питания</Label>
        <RadioGroup 
          value={data.dietType} 
          onValueChange={(value) => onChange({ dietType: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="omnivore" id="omnivore" />
            <Label htmlFor="omnivore">Всеядное</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegetarian" id="vegetarian" />
            <Label htmlFor="vegetarian">Вегетарианское</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegan" id="vegan" />
            <Label htmlFor="vegan">Веганское</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="keto" id="keto" />
            <Label htmlFor="keto">Кетогенное</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paleo" id="paleo" />
            <Label htmlFor="paleo">Палео</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mediterranean" id="mediterranean" />
            <Label htmlFor="mediterranean">Средиземноморское</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other_diet" />
            <Label htmlFor="other_diet">Другое</Label>
          </div>
        </RadioGroup>
        
        {data.dietType === 'other' && (
          <div className="mt-3">
            <Input
              placeholder="Опишите ваш тип питания"
              value={data.dietTypeOther || ''}
              onChange={(e) => onChange({ dietTypeOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Потребление воды */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Потребление воды (стаканов в день)</Label>
        <div className="px-3">
          <Slider
            value={[data.waterIntake]}
            onValueChange={(value) => onChange({ waterIntake: value[0] })}
            max={15}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className="font-medium">{data.waterIntake} стаканов</span>
            <span>15+</span>
          </div>
        </div>
      </div>

      {/* Потребление кофеина */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Потребление кофеина (чашек в день)</Label>
        <div className="px-3">
          <Slider
            value={[data.caffeineIntake]}
            onValueChange={(value) => onChange({ caffeineIntake: value[0] })}
            max={10}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className="font-medium">{data.caffeineIntake} чашек</span>
            <span>10+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleSection;
