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
    <div className="border-2 border-gray-200 bg-white rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">Введенные показатели</h4>
        <Badge variant="secondary" className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold min-h-[44px] bg-blue-500 text-white shadow-md">
          {biomarkers.length} показателей
        </Badge>
      </div>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {biomarkers.map((biomarker) => {
          const valueStatus = getValueStatus(biomarker.value!, biomarker.normal_range);
          const { description, ageEffect } = getImpactDescription(biomarker);
          
          return (
            <div key={biomarker.id} className="border-2 border-gray-100 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="space-y-4">
                {/* Заголовок с названием и статусом */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">{biomarker.name}</span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      {getImpactIcon(getBiomarkerImpact(biomarker.name).impact)}
                    </div>
                  </div>
                  <Badge className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold min-h-[44px] shadow-md ${valueStatus.color.includes('green') ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {valueStatus.status}
                  </Badge>
                </div>
                
                {/* Значение и норма */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border-l-4 border-blue-500">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">Ваш показатель:</span>
                    <div className="text-xl font-mono font-bold text-blue-600">
                      {biomarker.value} {biomarker.unit}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">Норма:</span>
                    <div className="text-lg font-mono font-semibold text-gray-900">
                      {biomarker.normal_range?.min} - {biomarker.normal_range?.max} {biomarker.unit}
                      {biomarker.normal_range?.optimal && (
                        <div className="text-base text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md mt-1 inline-block">
                          (опт: {biomarker.normal_range.optimal})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Описание функции */}
                <div className="text-base p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <span className="font-semibold text-gray-900">Функция:</span> 
                  <span className="text-gray-700 ml-2">{description}</span>
                </div>
                
                {/* Влияние на биологический возраст */}
                <div className="text-base p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <span className="font-semibold text-blue-900">Влияние на возраст:</span> 
                  <span className="text-blue-800 ml-2">{ageEffect}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {biomarkers.length === 0 && (
        <div className="text-center py-8 text-base text-gray-500 bg-gray-50 rounded-lg">
          <p className="font-medium">Введите показатели для получения детального анализа</p>
        </div>
      )}
    </div>
  );
};

export default FilledBiomarkersList;