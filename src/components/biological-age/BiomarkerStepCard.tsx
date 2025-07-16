import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  HelpCircle
} from 'lucide-react';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBiomarkerHistory } from '@/hooks/useBiomarkerHistory';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BiomarkerStepCardProps {
  biomarker: Biomarker;
  onValueChange: (biomarkerId: string, value: number) => void;
  healthProfile: HealthProfileData;
}

const BiomarkerStepCard: React.FC<BiomarkerStepCardProps> = ({
  biomarker,
  onValueChange,
  healthProfile
}) => {
  const [inputValue, setInputValue] = useState(
    biomarker.value?.toString() || ''
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const { getBiomarkerHistory } = useBiomarkerHistory();
  
  const biomarkerHistory = getBiomarkerHistory(biomarker.id);
  const lastEntry = biomarkerHistory.length > 0 ? biomarkerHistory[0] : null;

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      onValueChange(biomarker.id, numericValue);
    }
  };

  const getValueStatus = () => {
    if (!biomarker.value || !biomarker.normal_range) return 'unknown';
    
    const { min, max, optimal } = biomarker.normal_range;
    const value = biomarker.value;
    
    if (optimal) {
      const deviation = Math.abs(value - optimal) / optimal;
      if (deviation <= 0.1) return 'optimal';
      if (deviation <= 0.2) return 'good';
    }
    
    if (value < min) return 'low';
    if (value > max) return 'high';
    return 'normal';
  };

  const getStatusIcon = () => {
    const status = getValueStatus();
    switch (status) {
      case 'optimal':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'normal':
        return <Minus className="h-4 w-4 text-blue-600" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-orange-600" />;
      case 'high':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    const status = getValueStatus();
    switch (status) {
      case 'optimal':
        return 'border-green-200 bg-green-50';
      case 'good':
        return 'border-green-200 bg-green-50';
      case 'normal':
        return 'border-blue-200 bg-blue-50';
      case 'low':
        return 'border-orange-200 bg-orange-50';
      case 'high':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200';
    }
  };

  const getImportanceBadge = () => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      high: 'Важный',
      medium: 'Средний',
      low: 'Низкий'
    };

    return (
      <Badge className={`text-xs ${colors[biomarker.importance]}`}>
        {labels[biomarker.importance]}
      </Badge>
    );
  };

  const clearValue = () => {
    setInputValue('');
    // Reset biomarker status without changing the value to maintain state
  };

  return (
    <Card className={`transition-colors ${getStatusColor()}`}>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-sm font-medium">{biomarker.name}</Label>
                {getImportanceBadge()}
              </div>
              <p className="text-xs text-gray-600">{biomarker.description}</p>
              {lastEntry && (
                <div className="text-xs text-gray-500 mt-1">
                  Последний анализ: {format(new Date(lastEntry.created_at), 'dd.MM.yyyy', { locale: ru })} - {lastEntry.value} {lastEntry.unit}
                </div>
              )}
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{biomarker.analysis_type}</p>
                    <p className="text-xs">{biomarker.description}</p>
                    {biomarker.normal_range && (
                      <p className="text-xs">
                        Норма: {biomarker.normal_range.min}-{biomarker.normal_range.max} {biomarker.unit}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder={`Введите значение (${biomarker.unit})`}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-sm"
                step="any"
              />
              {biomarker.status === 'filled' && (
                <div className="flex items-center gap-1">
                  {getStatusIcon()}
                </div>
              )}
            </div>

            {/* Normal range display */}
            {biomarker.normal_range && (
              <div className="text-xs text-gray-600">
                <span>Норма: {biomarker.normal_range.min}-{biomarker.normal_range.max}</span>
                {biomarker.normal_range.optimal && (
                  <span className="ml-2 text-green-600">
                    Оптимум: {biomarker.normal_range.optimal}
                  </span>
                )}
                <span className="ml-1">{biomarker.unit}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {biomarker.status === 'filled' && (
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearValue}
                className="text-xs h-auto p-1"
              >
                Очистить
              </Button>
              
              <div className="text-xs text-gray-600">
                Значение: {biomarker.value} {biomarker.unit}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkerStepCard;