
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
    <div className={`border-2 border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 ${getImportanceColor()}`}>
      <div className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Label className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">{biomarker.name}</Label>
                <Badge className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold min-h-[44px] bg-red-500 text-white shadow-md transition-all duration-200 hover:bg-red-600" variant="outline">
                  <div className="flex items-center gap-1">
                    {getImpactIcon()}
                    <span className="text-sm font-semibold">{impact.description}</span>
                  </div>
                </Badge>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">{biomarker.description}</p>
            </div>
            <Badge className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold min-h-[44px] bg-green-500 text-white shadow-md transition-all duration-200" variant="secondary">
              {biomarker.status === 'filled' ? 'Заполнено' : 'Пусто'}
            </Badge>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-base md:text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors min-h-[44px] touch-manipulation">
              {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <span className="text-base font-medium">{isOpen ? 'Свернуть' : 'Ввести'}</span>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  step="0.01"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Значение"
                  className="flex-1 text-base h-12 px-4 rounded-lg border-2 focus:border-blue-500"
                />
                <span className="text-base text-gray-500 font-medium min-w-fit">{biomarker.unit}</span>
              </div>
              
              <div className="text-base space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">Норма:</span>
                  <span className="text-lg font-mono font-semibold text-blue-600">{adjustedRange.min} - {adjustedRange.max} {biomarker.unit}</span>
                  {adjustedRange.optimal && (
                    <span className="text-base text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md">
                      (опт: {adjustedRange.optimal})
                    </span>
                  )}
                </div>
                
                {valueStatus && (
                  <div className={`text-base font-semibold p-3 rounded-lg ${valueStatus.color} bg-opacity-10 border-l-4`} 
                       style={{borderLeftColor: valueStatus.color.includes('green') ? '#22C55E' : '#EF4444'}}>
                    {valueStatus.description}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default BiomarkerCard;
