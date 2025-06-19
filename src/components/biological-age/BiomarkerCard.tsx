
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';

interface BiomarkerCardProps {
  biomarker: Biomarker;
  onValueChange: (biomarkerId: string, value: number) => void;
  healthProfile: HealthProfileData;
  showAddButton?: boolean;
}

const BiomarkerCard: React.FC<BiomarkerCardProps> = ({
  biomarker,
  onValueChange,
  healthProfile,
  showAddButton = true
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (biomarker.value !== undefined) {
      setInputValue(biomarker.value.toString());
    }
  }, [biomarker.value]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      onValueChange(biomarker.id, numericValue);
    }
  };

  const getStatusColor = () => {
    if (biomarker.status === 'filled') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-600';
  };

  const getImportanceColor = () => {
    switch (biomarker.importance) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <Card className={`border-l-4 ${getImportanceColor()}`}>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium">{biomarker.name}</Label>
              <p className="text-xs text-gray-600 mt-1">{biomarker.description}</p>
            </div>
            <Badge className={getStatusColor()}>
              {biomarker.status === 'filled' ? 'Заполнено' : 'Не заполнено'}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Введите значение"
                className="flex-1"
              />
              <span className="text-sm text-gray-500 min-w-fit">{biomarker.unit}</span>
            </div>
            
            <div className="text-xs text-gray-600">
              <span className="font-medium">Норма:</span> {biomarker.normal_range.min} - {biomarker.normal_range.max} {biomarker.unit}
            </div>
            
            <div className="text-xs text-gray-500">
              <span className="font-medium">Анализ:</span> {biomarker.analysis_type}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkerCard;
