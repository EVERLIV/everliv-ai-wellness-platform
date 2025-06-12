
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface SleepSectionProps {
  data: any;
  onChange: (updates: any) => void;
}

const SleepSection: React.FC<SleepSectionProps> = ({ data, onChange }) => {
  const handleSleepIssueChange = (issue: string, checked: boolean) => {
    const currentIssues = data.sleepIssues || [];
    let newIssues;
    
    if (checked) {
      newIssues = [...currentIssues, issue];
    } else {
      newIssues = currentIssues.filter((i: string) => i !== issue);
    }
    
    onChange({ sleepIssues: newIssues });
  };

  return (
    <div className="space-y-6">
      {/* Часы сна */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Количество часов сна в сутки</Label>
        <div className="px-3">
          <Slider
            value={[data.sleepHours]}
            onValueChange={(value) => onChange({ sleepHours: value[0] })}
            max={12}
            min={3}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3 часа</span>
            <span className="font-medium">{data.sleepHours} часов</span>
            <span>12 часов</span>
          </div>
        </div>
      </div>

      {/* Качество сна */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Качество сна</Label>
        <RadioGroup 
          value={data.sleepQuality} 
          onValueChange={(value) => onChange({ sleepQuality: value })}
          className="grid grid-cols-1 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excellent" id="excellent_sleep" />
            <Label htmlFor="excellent_sleep">Отличное</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="good_sleep" />
            <Label htmlFor="good_sleep">Хорошее</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="fair_sleep" />
            <Label htmlFor="fair_sleep">Удовлетворительное</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="poor_sleep" />
            <Label htmlFor="poor_sleep">Плохое</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="very_poor" id="very_poor_sleep" />
            <Label htmlFor="very_poor_sleep">Очень плохое</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other_sleep_quality" />
            <Label htmlFor="other_sleep_quality">Другое</Label>
          </div>
        </RadioGroup>
        
        {data.sleepQuality === 'other' && (
          <div className="mt-3">
            <Input
              placeholder="Опишите качество вашего сна"
              value={data.sleepQualityOther || ''}
              onChange={(e) => onChange({ sleepQualityOther: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Проблемы со сном */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Проблемы со сном</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Трудности с засыпанием',
            'Частые пробуждения ночью',
            'Раннее пробуждение',
            'Храп',
            'Апноэ сна',
            'Беспокойные ноги',
            'Кошмары'
          ].map((issue) => (
            <div key={issue} className="flex items-center space-x-2">
              <Checkbox
                id={issue}
                checked={(data.sleepIssues || []).includes(issue)}
                onCheckedChange={(checked) => handleSleepIssueChange(issue, !!checked)}
              />
              <Label htmlFor={issue}>{issue}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other_sleep_issue"
              checked={(data.sleepIssues || []).includes('other')}
              onCheckedChange={(checked) => handleSleepIssueChange('other', !!checked)}
            />
            <Label htmlFor="other_sleep_issue">Другое</Label>
          </div>
        </div>
        
        {(data.sleepIssues || []).includes('other') && (
          <div className="mt-3">
            <Input
              placeholder="Опишите другие проблемы со сном"
              value={data.sleepIssuesOther || ''}
              onChange={(e) => onChange({ sleepIssuesOther: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepSection;
