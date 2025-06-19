
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextInputSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const getExampleText = () => {
  return `Пример анализа крови:

Гемоглобин: 145 г/л
Эритроциты: 4.8×10¹²/л
Лейкоциты: 6.2×10⁹/л
Тромбоциты: 280×10⁹/л
СОЭ: 12 мм/ч

Или введите другие показатели:
Показатель: значение единица_измерения
Показатель: значение единица_измерения
...`;
};

const TextInputSection: React.FC<TextInputSectionProps> = ({
  value,
  onChange
}) => {
  return (
    <div>
      <label htmlFor="analysis-text" className="text-sm font-medium text-gray-700 mb-2 block">
        Результаты анализа
      </label>
      <Textarea 
        id="analysis-text"
        placeholder={getExampleText()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        className="resize-none font-mono text-sm"
      />
    </div>
  );
};

export default TextInputSection;
