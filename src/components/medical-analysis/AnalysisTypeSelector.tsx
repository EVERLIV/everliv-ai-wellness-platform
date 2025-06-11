
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ANALYSIS_TYPES = [
  { value: "blood", label: "Анализ крови" },
  { value: "urine", label: "Анализ мочи" },
  { value: "biochemistry", label: "Биохимический анализ" },
  { value: "hormones", label: "Гормональная панель" },
  { value: "vitamins", label: "Витамины и микроэлементы" },
  { value: "immunology", label: "Иммунологические исследования" },
  { value: "oncology", label: "Онкомаркеры" },
  { value: "cardiology", label: "Кардиологические маркеры" },
  { value: "other", label: "Другой тип анализа" }
];

interface AnalysisTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AnalysisTypeSelector: React.FC<AnalysisTypeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div>
      <label htmlFor="analysis-type" className="text-sm font-medium text-gray-700 mb-2 block">
        Тип анализа
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="analysis-type">
          <SelectValue placeholder="Выберите тип анализа" />
        </SelectTrigger>
        <SelectContent>
          {ANALYSIS_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AnalysisTypeSelector;
export { ANALYSIS_TYPES };
