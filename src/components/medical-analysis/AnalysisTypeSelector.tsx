
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalysisTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AnalysisTypeSelector: React.FC<AnalysisTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <Label htmlFor="analysisType">Тип анализа</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите тип анализа" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="blood">Анализ крови</SelectItem>
          <SelectItem value="urine">Анализ мочи</SelectItem>
          <SelectItem value="biochemistry">Биохимический анализ</SelectItem>
          <SelectItem value="hormones">Гормональный анализ</SelectItem>
          <SelectItem value="vitamins">Анализ витаминов</SelectItem>
          <SelectItem value="other">Другой анализ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AnalysisTypeSelector;
