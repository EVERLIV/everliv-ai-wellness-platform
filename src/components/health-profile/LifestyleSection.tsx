
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface LifestyleSectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const LifestyleSection: React.FC<LifestyleSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Курение */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Статус курения</Label>
        <RadioGroup 
          value={data.smokingStatus} 
          onValueChange={(value) => onChange({ smokingStatus: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="never" />
            <Label htmlFor="never">Никогда не курил(а)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="former" id="former" />
            <Label htmlFor="former">Бывший курильщик (бросил более года назад)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recent_quitter" id="recent_quitter" />
            <Label htmlFor="recent_quitter">Недавно бросил (менее года)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="occasional" id="occasional" />
            <Label htmlFor="occasional">Курю иногда (социальное курение)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="regular" id="regular" />
            <Label htmlFor="regular">Курю регулярно</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="heavy" id="heavy" />
            <Label htmlFor="heavy">Курю много (более пачки в день)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Потребление алкоголя */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Потребление алкоголя</Label>
        <RadioGroup 
          value={data.alcoholConsumption} 
          onValueChange={(value) => onChange({ alcoholConsumption: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="alcohol_never" />
            <Label htmlFor="alcohol_never">Не употребляю</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rarely" id="rarely" />
            <Label htmlFor="rarely">Редко (несколько раз в год)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="occasionally" id="occasionally" />
            <Label htmlFor="occasionally">Иногда (1-2 раза в месяц)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderately" id="moderately" />
            <Label htmlFor="moderately">Умеренно (1-2 раза в неделю)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="frequently" id="frequently" />
            <Label htmlFor="frequently">Часто (3-4 раза в неделю)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Ежедневно</Label>
          </div>
        </RadioGroup>
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
            <Label htmlFor="omnivore">Всеядный</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegetarian" id="vegetarian" />
            <Label htmlFor="vegetarian">Вегетарианский</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegan" id="vegan" />
            <Label htmlFor="vegan">Веганский</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pescatarian" id="pescatarian" />
            <Label htmlFor="pescatarian">Пескетарианский</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="keto" id="keto" />
            <Label htmlFor="keto">Кето-диета</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paleo" id="paleo" />
            <Label htmlFor="paleo">Палео-диета</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mediterranean" id="mediterranean" />
            <Label htmlFor="mediterranean">Средиземноморская диета</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Потребление воды */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Потребление воды (стаканов в день)</Label>
        <div className="px-3">
          <Slider
            value={[data.waterIntake]}
            onValueChange={(value) => onChange({ waterIntake: value[0] })}
            max={15}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 стакан</span>
            <span className="font-medium">{data.waterIntake} стаканов (~{(data.waterIntake * 0.25).toFixed(1)}л)</span>
            <span>15 стаканов</span>
          </div>
        </div>
      </div>

      {/* Потребление кофеина */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Потребление кофеина (чашек кофе в день)</Label>
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
            <span>0 чашек</span>
            <span className="font-medium">{data.caffeineIntake} чашек</span>
            <span>10+ чашек</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleSection;
