import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Biomarker } from '@/types/biologicalAge';
import { getBiomarkerImpact } from '@/services/ai/biomarker-impact-analysis';

interface FilledBiomarkersListProps {
  biomarkers: Biomarker[];
}

const FilledBiomarkersList: React.FC<FilledBiomarkersListProps> = ({ biomarkers }) => {
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'medium': return <TrendingDown className="h-3 w-3 text-yellow-500" />;
      case 'low': return <Minus className="h-3 w-3 text-green-500" />;
      default: return <Info className="h-3 w-3 text-gray-400" />;
    }
  };

  const getValueStatus = (value: number, normalRange: any) => {
    if (!normalRange) return { color: 'text-gray-600', status: 'Неопределено' };
    
    const { min, max, optimal } = normalRange;
    
    if (optimal) {
      const deviation = Math.abs(value - optimal) / optimal;
      if (deviation <= 0.1) return { color: 'text-green-600', status: 'Оптимально' };
      if (deviation <= 0.2) return { color: 'text-yellow-600', status: 'Хорошо' };
      return { color: 'text-red-600', status: 'Отклонение' };
    }
    
    if (value >= min && value <= max) return { color: 'text-green-600', status: 'В норме' };
    if (value < min) return { color: 'text-red-600', status: 'Ниже нормы' };
    return { color: 'text-red-600', status: 'Выше нормы' };
  };

  const getImpactDescription = (biomarker: Biomarker) => {
    const impact = getBiomarkerImpact(biomarker.name);
    
    // Создаем описание влияния на возраст на основе типа воздействия
    let ageEffect = 'Влияет на процессы старения организма';
    
    switch (impact.impact) {
      case 'high':
        ageEffect = 'Сильно влияет на биологический возраст - важный маркер старения';
        break;
      case 'medium':
        ageEffect = 'Умеренно влияет на биологический возраст';
        break;
      case 'low':
        ageEffect = 'Слабо влияет на общий биологический возраст';
        break;
    }
    
    return {
      description: impact.description,
      ageEffect
    };
  };

  return (
    <div className="border border-gray-200 bg-white p-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[8px] md:text-xs font-medium text-gray-900">Введенные показатели</h4>
        <Badge variant="secondary" size="sm" className="text-[6px] md:text-xs px-1 py-0.5">
          {biomarkers.length} показателей
        </Badge>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {biomarkers.map((biomarker) => {
          const valueStatus = getValueStatus(biomarker.value!, biomarker.normal_range);
          const { description, ageEffect } = getImpactDescription(biomarker);
          
          return (
            <div key={biomarker.id} className="border border-gray-100 p-2 bg-gray-50">
              <div className="space-y-1">
                {/* Заголовок с названием и статусом */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] md:text-xs font-medium text-gray-900">{biomarker.name}</span>
                    {getImpactIcon(getBiomarkerImpact(biomarker.name).impact)}
                  </div>
                  <span className={`text-[8px] md:text-xs font-medium ${valueStatus.color}`}>
                    {valueStatus.status}
                  </span>
                </div>
                
                {/* Значение и норма */}
                <div className="grid grid-cols-2 gap-2 text-[8px] md:text-xs">
                  <div>
                    <span className="text-gray-600">Ваш показатель:</span>
                    <div className="font-medium text-gray-900">
                      {biomarker.value} {biomarker.unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Норма:</span>
                    <div className="font-medium text-gray-900">
                      {biomarker.normal_range?.min} - {biomarker.normal_range?.max} {biomarker.unit}
                      {biomarker.normal_range?.optimal && (
                        <div className="text-green-600">
                          (опт: {biomarker.normal_range.optimal})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Описание функции */}
                <div className="text-[8px] md:text-xs text-gray-600">
                  <span className="font-medium">Функция:</span> {description}
                </div>
                
                {/* Влияние на биологический возраст */}
                <div className="text-[8px] md:text-xs text-blue-600 bg-blue-50 p-1 rounded">
                  <span className="font-medium">Влияние на возраст:</span> {ageEffect}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {biomarkers.length === 0 && (
        <div className="text-center py-4 text-[8px] md:text-xs text-gray-500">
          Введите показатели для получения детального анализа
        </div>
      )}
    </div>
  );
};

export default FilledBiomarkersList;