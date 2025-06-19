
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check, Plus } from 'lucide-react';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';

interface BiomarkerCardProps {
  biomarker: Biomarker;
  onValueChange: (biomarkerId: string, value: number) => void;
  healthProfile: HealthProfileData;
}

const BiomarkerCard: React.FC<BiomarkerCardProps> = ({
  biomarker,
  onValueChange,
  healthProfile
}) => {
  const [inputValue, setInputValue] = useState(biomarker.value?.toString() || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onValueChange(biomarker.id, numValue);
      setIsEditing(false);
    }
  };

  const getStatusColor = () => {
    if (biomarker.status === 'not_filled') return 'bg-gray-100 text-gray-600';
    
    if (biomarker.value === undefined) return 'bg-gray-100 text-gray-600';
    
    const { min, max, optimal } = biomarker.normal_range;
    const value = biomarker.value;
    
    if (optimal && Math.abs(value - optimal) <= (max - min) * 0.1) {
      return 'bg-green-100 text-green-700';
    } else if (value >= min && value <= max) {
      return 'bg-yellow-100 text-yellow-700';
    } else {
      return 'bg-red-100 text-red-700';
    }
  };

  const getStatusText = () => {
    if (biomarker.status === 'not_filled') return 'Не заполнено';
    
    if (biomarker.value === undefined) return 'Не заполнено';
    
    const { min, max, optimal } = biomarker.normal_range;
    const value = biomarker.value;
    
    if (optimal && Math.abs(value - optimal) <= (max - min) * 0.1) {
      return 'Оптимально';
    } else if (value >= min && value <= max) {
      return 'В норме';
    } else if (value < min) {
      return 'Ниже нормы';
    } else {
      return 'Выше нормы';
    }
  };

  const getNormalRangeText = () => {
    const { min, max, optimal } = biomarker.normal_range;
    let text = `${min} - ${max} ${biomarker.unit}`;
    if (optimal) {
      text += ` (оптимально: ${optimal})`;
    }
    return text;
  };

  const getImportanceBadge = () => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700'
    };
    
    const labels = {
      high: 'Высокая важность',
      medium: 'Средняя важность',
      low: 'Низкая важность'
    };

    return (
      <Badge className={colors[biomarker.importance]}>
        {labels[biomarker.importance]}
      </Badge>
    );
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{biomarker.name}</CardTitle>
          {biomarker.status === 'filled' ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {getImportanceBadge()}
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 mb-1">{biomarker.description}</p>
          <p className="text-xs text-gray-500">
            <strong>Норма:</strong> {getNormalRangeText()}
          </p>
        </div>

        {isEditing || biomarker.status === 'not_filled' ? (
          <div className="space-y-2">
            <Label htmlFor={`biomarker-${biomarker.id}`}>
              Значение ({biomarker.unit})
            </Label>
            <div className="flex gap-2">
              <Input
                id={`biomarker-${biomarker.id}`}
                type="number"
                step="0.01"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Введите значение в ${biomarker.unit}`}
                className="flex-1"
              />
              <Button onClick={handleSave} size="sm">
                {biomarker.status === 'filled' ? 'Обновить' : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Текущее значение:</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                Изменить
              </Button>
            </div>
            <div className="text-lg font-semibold">
              {biomarker.value} {biomarker.unit}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <strong>Тип анализа:</strong> {biomarker.analysis_type}
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkerCard;
