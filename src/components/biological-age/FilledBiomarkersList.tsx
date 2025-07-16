import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Info, Loader2 } from 'lucide-react';
import { Biomarker } from '@/types/biologicalAge';
import { getBiomarkerImpact } from '@/services/ai/biomarker-impact-analysis';
import { supabase } from '@/integrations/supabase/client';

interface FilledBiomarkersListProps {
  biomarkers: Biomarker[];
}

const FilledBiomarkersList: React.FC<FilledBiomarkersListProps> = ({ biomarkers }) => {
  const [recommendations, setRecommendations] = useState<Record<string, string>>({});
  const [loadingRecommendations, setLoadingRecommendations] = useState<Record<string, boolean>>({});

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

  const generateAIRecommendation = async (biomarker: Biomarker) => {
    if (!biomarker.value || !biomarker.normal_range) return null;
    
    const valueStatus = getValueStatus(biomarker.value, biomarker.normal_range);
    if (valueStatus.status === 'В норме' || valueStatus.status === 'Оптимально') {
      return null;
    }

    // Проверяем, есть ли уже рекомендация в кэше
    if (recommendations[biomarker.id]) {
      return recommendations[biomarker.id];
    }

    // Если уже загружаем, не делаем повторный запрос
    if (loadingRecommendations[biomarker.id]) {
      return null;
    }

    setLoadingRecommendations(prev => ({ ...prev, [biomarker.id]: true }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-biomarker-recommendations', {
        body: {
          name: biomarker.name,
          value: biomarker.value,
          unit: biomarker.unit,
          normalRange: biomarker.normal_range,
          status: valueStatus.status,
          userAge: 35, // Можно передавать из профиля пользователя
          userGender: 'мужской' // Можно передавать из профиля пользователя
        }
      });

      if (error) {
        console.error('Error generating recommendation:', error);
        return 'Обратитесь к врачу для персонализированных рекомендаций';
      }

      const aiRecommendation = data.recommendation;
      console.log('Received AI recommendation:', aiRecommendation);
      setRecommendations(prev => ({ ...prev, [biomarker.id]: aiRecommendation }));
      return aiRecommendation;

    } catch (error) {
      console.error('Error generating AI recommendation:', error);
      return 'Обратитесь к врачу для персонализированных рекомендаций';
    } finally {
      setLoadingRecommendations(prev => ({ ...prev, [biomarker.id]: false }));
    }
  };

  useEffect(() => {
    // Генерируем рекомендации для биомаркеров с отклонениями
    biomarkers.forEach(biomarker => {
      if (biomarker.value && biomarker.normal_range) {
        const valueStatus = getValueStatus(biomarker.value, biomarker.normal_range);
        if (valueStatus.status !== 'В норме' && valueStatus.status !== 'Оптимально') {
          generateAIRecommendation(biomarker);
        }
      }
    });
  }, [biomarkers]);

  return (
    <div className="border border-gray-200 bg-white p-1 md:p-2">
      <div className="flex items-center justify-between mb-1 md:mb-2">
        <h4 className="bio-text-small font-medium">Введенные показатели</h4>
        <Badge variant="secondary" size="sm" className="text-[8px] px-0.5 py-0 h-4">
          {biomarkers.length} показателей
        </Badge>
      </div>
      
      <div className="space-y-1 md:space-y-2 max-h-80 overflow-y-auto">
        {biomarkers.map((biomarker) => {
          const valueStatus = getValueStatus(biomarker.value!, biomarker.normal_range);
          const impact = getBiomarkerImpact(biomarker.name);
          const aiRecommendation = recommendations[biomarker.id];
          const isLoadingRecommendation = loadingRecommendations[biomarker.id];
          
          return (
            <div key={biomarker.id} className="border border-gray-100 p-1 md:p-2 bg-gray-50">
              <div className="space-y-0.5 md:space-y-1">
                {/* Заголовок с названием и статусом */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 md:gap-1">
                    <span className="bio-text-caption font-medium">{biomarker.name}</span>
                    {getImpactIcon(getBiomarkerImpact(biomarker.name).impact)}
                  </div>
                  <span className={`bio-text-caption font-medium ${valueStatus.color}`}>
                    {valueStatus.status}
                  </span>
                </div>
                
                {/* Значение и норма */}
                <div className="grid grid-cols-2 gap-1 md:gap-2 bio-text-caption">
                  <div>
                    <span className="bio-text-caption text-muted-foreground">Ваш показатель:</span>
                    <div className="bio-text-caption font-medium text-foreground">
                      {biomarker.value} {biomarker.unit}
                    </div>
                  </div>
                  <div>
                    <span className="bio-text-caption text-muted-foreground">Норма:</span>
                    <div className="bio-text-caption font-medium text-foreground">
                      {biomarker.normal_range?.min} - {biomarker.normal_range?.max} {biomarker.unit}
                      {biomarker.normal_range?.optimal && (
                        <div className="text-green-600 bio-text-caption">
                          (опт: {biomarker.normal_range.optimal})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Описание функции */}
                <div className="bio-text-caption text-muted-foreground">
                  <span className="bio-text-caption font-medium">Функция:</span> {impact.description}
                </div>
                
                {/* ИИ рекомендации при отклонениях */}
                {(valueStatus.status !== 'В норме' && valueStatus.status !== 'Оптимально') && (
                  <div className="bio-text-caption text-orange-600 bg-orange-50 p-1 rounded">
                    <div className="flex items-start gap-1">
                      <span className="bio-text-caption font-medium">Рекомендации ИИ:</span>
                      {isLoadingRecommendation ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Генерирую...</span>
                        </div>
                      ) : (
                        <span className="bio-text-caption leading-tight">
                          {aiRecommendation || 'Загрузка рекомендаций...'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {biomarkers.length === 0 && (
        <div className="text-center py-2 md:py-4 bio-text-caption text-muted-foreground">
          Введите показатели для получения детального анализа
        </div>
      )}
    </div>
  );
};

export default FilledBiomarkersList;