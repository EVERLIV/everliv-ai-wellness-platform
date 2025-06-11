
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextInputSectionProps {
  value: string;
  onChange: (value: string) => void;
  isAnalyzing: boolean;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({
  value,
  onChange,
  isAnalyzing,
}) => {
  return (
    <div>
      <Label htmlFor="analysis-text-input">Результаты анализа</Label>
      <Textarea
        id="analysis-text-input"
        placeholder="Введите результаты вашего анализа..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] mt-2"
        disabled={isAnalyzing}
      />
    </div>
  );
};

export default TextInputSection;
