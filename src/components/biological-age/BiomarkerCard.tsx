
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import { getBiomarkerImpact } from '@/services/ai/biomarker-impact-analysis';
import { calculateNormalRange, getValueStatus } from '@/utils/normalRangeCalculator';

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
  showAddButton = false
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (biomarker.value !== undefined) {
      setInputValue(biomarker.value.toString());
      setIsOpen(true);
    }
  }, [biomarker.value]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      onValueChange(biomarker.id, numericValue);
    }
  };

  const impact = getBiomarkerImpact(biomarker.name);
  const adjustedRange = calculateNormalRange(
    biomarker.id,
    healthProfile.age,
    healthProfile.gender,
    biomarker.normal_range
  );
  const valueStatus = biomarker.value ? getValueStatus(biomarker.value, adjustedRange) : null;

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

  const getImpactIcon = () => {
    switch (impact.impact) {
      case 'high': return <TrendingUp className="h-3 w-3" />;
      case 'medium': return <TrendingDown className="h-3 w-3" />;
      case 'low': return <Minus className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  const getImpactColor = () => {
    switch (impact.impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`border border-gray-200 bg-white border-l-2 ${getImportanceColor()}`}>
      <div className="p-2">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-xs font-medium">{biomarker.name}</Label>
                <Badge className={`text-xs border ${getImpactColor()}`} variant="outline">
                  <div className="flex items-center gap-1">
                    {getImpactIcon()}
                    {impact.description}
                  </div>
                </Badge>
              </div>
              <p className="text-xs text-gray-600">{biomarker.description}</p>
            </div>
            <Badge className={getStatusColor()} variant="secondary">
              {biomarker.status === 'filled' ? 'Заполнено' : 'Не заполнено'}
            </Badge>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
              {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              {isOpen ? 'Свернуть' : 'Ввести значение'}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-2 mt-2">
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  step="0.01"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Введите значение"
                  className="flex-1 text-xs h-7"
                />
                <span className="text-xs text-gray-500 min-w-fit">{biomarker.unit}</span>
              </div>
              
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Норма:</span>
                  <span>{adjustedRange.min} - {adjustedRange.max} {biomarker.unit}</span>
                  {adjustedRange.optimal && (
                    <span className="text-emerald-600">(опт: {adjustedRange.optimal})</span>
                  )}
                </div>
                
                {valueStatus && (
                  <div className={`text-xs font-medium ${valueStatus.color}`}>
                    Статус: {valueStatus.description}
                  </div>
                )}
                
                <div className="text-gray-500">
                  <span className="font-medium">Анализ:</span> {biomarker.analysis_type}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default BiomarkerCard;
