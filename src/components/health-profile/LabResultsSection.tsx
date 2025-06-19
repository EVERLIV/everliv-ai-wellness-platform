
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTube, Microscope } from "lucide-react";

interface LabResults {
  [key: string]: number | string | undefined;
  hemoglobin?: number;
  erythrocytes?: number;
  hematocrit?: number;
  mcv?: number;
  mchc?: number;
  platelets?: number;
  serumIron?: number;
  cholesterol?: number;
  bloodSugar?: number;
  ldh?: number;
  testDate?: string;
  lastUpdated?: string;
}

interface LabResultsSectionProps {
  labResults: LabResults;
  onChange: (updates: LabResults) => void;
}

const LabResultsSection: React.FC<LabResultsSectionProps> = ({
  labResults,
  onChange
}) => {
  const handleChange = (field: keyof LabResults, value: string) => {
    const numericValue = value === '' ? undefined : parseFloat(value);
    onChange({ ...labResults, [field]: numericValue });
  };

  return (
    <div className="space-y-6">
      {/* Общий анализ крови */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-red-500" />
            Общий анализ крови
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hemoglobin">Гемоглобин (г/л)</Label>
              <Input
                id="hemoglobin"
                type="number"
                placeholder="120-160"
                value={labResults.hemoglobin || ''}
                onChange={(e) => handleChange('hemoglobin', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: М 130-160, Ж 120-150</p>
            </div>
            <div>
              <Label htmlFor="erythrocytes">Эритроциты (млн/мкл)</Label>
              <Input
                id="erythrocytes"
                type="number"
                step="0.1"
                placeholder="4.0-5.5"
                value={labResults.erythrocytes || ''}
                onChange={(e) => handleChange('erythrocytes', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: М 4.0-5.5, Ж 3.9-5.0</p>
            </div>
            <div>
              <Label htmlFor="hematocrit">Гематокрит (%)</Label>
              <Input
                id="hematocrit"
                type="number"
                placeholder="35-45"
                value={labResults.hematocrit || ''}
                onChange={(e) => handleChange('hematocrit', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: М 40-48, Ж 36-42</p>
            </div>
            <div>
              <Label htmlFor="mcv">MCV (фл)</Label>
              <Input
                id="mcv"
                type="number"
                placeholder="80-100"
                value={labResults.mcv || ''}
                onChange={(e) => handleChange('mcv', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: 80-100</p>
            </div>
            <div>
              <Label htmlFor="mchc">MCHC (г/дл)</Label>
              <Input
                id="mchc"
                type="number"
                placeholder="32-36"
                value={labResults.mchc || ''}
                onChange={(e) => handleChange('mchc', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: 32-36</p>
            </div>
            <div>
              <Label htmlFor="platelets">Тромбоциты (тыс/мкл)</Label>
              <Input
                id="platelets"
                type="number"
                placeholder="150-400"
                value={labResults.platelets || ''}
                onChange={(e) => handleChange('platelets', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: 150-400</p>
            </div>
            <div>
              <Label htmlFor="serumIron">Сывороточное железо (мкмоль/л)</Label>
              <Input
                id="serumIron"
                type="number"
                placeholder="11-31"
                value={labResults.serumIron || ''}
                onChange={(e) => handleChange('serumIron', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: М 11-31, Ж 9-27</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Биохимические исследования */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-5 w-5 text-blue-500" />
            Биохимические исследования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cholesterol">Холестерин общий (ммоль/л)</Label>
              <Input
                id="cholesterol"
                type="number"
                step="0.1"
                placeholder="3.0-5.2"
                value={labResults.cholesterol || ''}
                onChange={(e) => handleChange('cholesterol', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: 3.0-5.2</p>
            </div>
            <div>
              <Label htmlFor="bloodSugar">Глюкоза крови (ммоль/л)</Label>
              <Input
                id="bloodSugar"
                type="number"
                step="0.1"
                placeholder="3.9-6.1"
                value={labResults.bloodSugar || ''}
                onChange={(e) => handleChange('bloodSugar', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: 3.9-6.1</p>
            </div>
            <div>
              <Label htmlFor="ldh">ЛДГ (Ед/л)</Label>
              <Input
                id="ldh"
                type="number"
                placeholder="120-240"
                value={labResults.ldh || ''}
                onChange={(e) => handleChange('ldh', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Норма: 120-240</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="testDate">Дата анализов</Label>
            <Input
              id="testDate"
              type="date"
              value={labResults.testDate || ''}
              onChange={(e) => onChange({ ...labResults, testDate: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabResultsSection;
