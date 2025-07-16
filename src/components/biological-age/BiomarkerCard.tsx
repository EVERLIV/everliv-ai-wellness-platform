
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus, History, Calendar } from 'lucide-react';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import { getBiomarkerImpact } from '@/services/ai/biomarker-impact-analysis';
import { calculateNormalRange, getValueStatus } from '@/utils/normalRangeCalculator';
import BiomarkerHistoryModal from './BiomarkerHistoryModal';
import { useBiomarkerHistory } from '@/hooks/useBiomarkerHistory';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { getBiomarkerHistory } = useBiomarkerHistory();
  
  // Получаем историю для данного биомаркера
  const biomarkerHistory = getBiomarkerHistory(biomarker.id);
  const lastEntry = biomarkerHistory.length > 0 ? biomarkerHistory[0] : null;

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

  const getImpactDot = () => {
    switch (impact.impact) {
      case 'high': return <div className="w-2 h-2 rounded-full bg-red-500" />;
      case 'medium': return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
      case 'low': return <div className="w-2 h-2 rounded-full bg-green-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-gray-400" />;
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

  // Функция для получения фонового цвета карточки на основе статуса значения
  const getCardBackgroundColor = () => {
    if (biomarker.status !== 'filled' || !biomarker.value) {
      return 'bg-white'; // Белый фон для незаполненных
    }

    const valueStatus = getValueStatus(biomarker.value, adjustedRange);
    switch (valueStatus.status) {
      case 'optimal':
      case 'normal':
        return 'bg-green-50/50'; // Очень слабый зеленый для нормы
      case 'high':
        return 'bg-red-50/50'; // Очень слабый красный для повышенных
      case 'low':
        return 'bg-blue-50/50'; // Очень слабый синий для пониженных
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`border border-gray-200 ${getCardBackgroundColor()}`}>{/* Убираем border-l-2 и добавляем фоновый цвет */}
      <div className="p-1.5">
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-0.5">
                <Label className="bio-text-caption font-medium">{biomarker.name}</Label>
                {getImpactDot()}
              </div>
              <p className="bio-text-caption text-muted-foreground line-clamp-1">{biomarker.description}</p>
            </div>
            <Badge className={`${getStatusColor()} text-[8px] px-1 py-0.5 text-center leading-none`} variant="secondary">
              {biomarker.status === 'filled' ? 'Заполнено' : 'Пусто'}
            </Badge>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
              {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              {isOpen ? 'Свернуть' : 'Ввести'}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-1 mt-1">
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Значение"
                  className="flex-1 text-xs h-6"
                />
                <span className="text-xs text-gray-500 min-w-fit">{biomarker.unit}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowHistoryModal(true)}
                  className="h-6 w-6 p-0 hover:bg-primary/10"
                  title="История показателей"
                >
                  <Calendar className="h-3 w-3 text-primary" />
                </Button>
              </div>
              
              <div className="bio-text-caption space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="bio-text-caption font-medium">Норма:</span>
                  <span className="bio-text-caption">{adjustedRange.min} - {adjustedRange.max} {biomarker.unit}</span>
                  {adjustedRange.optimal && (
                    <span className="text-emerald-600">(опт: {adjustedRange.optimal})</span>
                  )}
                </div>
                
                {valueStatus && (
                  <div className={`bio-text-caption font-medium ${valueStatus.color}`}>
                    {valueStatus.description}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Информация о последнем анализе - показывается когда карточка свернута */}
          {!isOpen && lastEntry && (
            <div className="bio-text-caption text-muted-foreground mt-1">
              Последний анализ: {format(new Date(lastEntry.created_at), 'dd.MM.yyyy', { locale: ru })} - {lastEntry.value} {lastEntry.unit}
            </div>
          )}
        </div>
      </div>

      <BiomarkerHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        biomarkerId={biomarker.id}
        biomarkerName={biomarker.name}
        unit={biomarker.unit}
        normalRange={biomarker.normal_range}
      />
    </div>
  );
};

export default BiomarkerCard;
