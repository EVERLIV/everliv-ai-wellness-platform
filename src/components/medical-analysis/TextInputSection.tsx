
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ANALYSIS_TYPES } from "./AnalysisTypeSelector";

interface TextInputSectionProps {
  value: string;
  onChange: (value: string) => void;
  analysisType: string;
}

const getExampleText = (type: string) => {
  switch (type) {
    case "blood":
      return `Пример анализа крови:

Гемоглобин: 145 г/л
Эритроциты: 4.8×10¹²/л
Лейкоциты: 6.2×10⁹/л
Тромбоциты: 280×10⁹/л
СОЭ: 12 мм/ч`;

    case "urine":
      return `Пример анализа мочи:

Цвет: светло-желтый
Прозрачность: прозрачная
Плотность: 1.018
Белок: 0.025 г/л
Глюкоза: не обнаружена
Лейкоциты: 2-3 в п/з`;

    case "biochemistry":
      return `Пример биохимического анализа:

Глюкоза: 5.2 ммоль/л
Общий белок: 72 г/л
АЛТ: 28 Ед/л
АСТ: 24 Ед/л
Креатинин: 85 мкмоль/л
Мочевина: 6.2 ммоль/л`;

    case "hormones":
      return `Пример гормональной панели:

ТТГ: 2.8 мЕд/л
Т4 свободный: 14.2 пмоль/л
Т3 свободный: 4.8 пмоль/л
Кортизол: 425 нмоль/л
Инсулин: 8.5 мкЕд/мл`;

    default:
      return `Введите результаты вашего анализа:

Показатель: значение единица_измерения
Показатель: значение единица_измерения
...`;
  }
};

const TextInputSection: React.FC<TextInputSectionProps> = ({
  value,
  onChange,
  analysisType
}) => {
  const selectedAnalysisType = ANALYSIS_TYPES.find(type => type.value === analysisType);

  return (
    <div>
      <label htmlFor="analysis-text" className="text-sm font-medium text-gray-700 mb-2 block">
        Результаты {selectedAnalysisType?.label.toLowerCase()}
      </label>
      <Textarea 
        id="analysis-text"
        placeholder={getExampleText(analysisType)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        className="resize-none font-mono text-sm"
      />
    </div>
  );
};

export default TextInputSection;
