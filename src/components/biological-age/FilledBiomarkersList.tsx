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

  const getRecommendationForBiomarker = (biomarker: Biomarker) => {
    const valueStatus = getValueStatus(biomarker.value!, biomarker.normal_range);
    
    if (valueStatus.status === 'В норме' || valueStatus.status === 'Оптимально') {
      return null; // Не показываем рекомендации если всё в норме
    }
    
    // Генерируем детальные рекомендации в зависимости от типа отклонения и биомаркера
    const biomarkerName = biomarker.name.toLowerCase();
    
    if (valueStatus.status === 'Выше нормы') {
      if (biomarkerName.includes('холестерин') || biomarkerName.includes('лпнп')) {
        return 'Добавки: Омега-3 (2-3г/день), Красный дрожжевой рис, Коэнзим Q10. Упражнения: Кардио 150мин/неделя, силовые 2-3 раза. Питание: Исключить трансжиры, добавить овсянку, орехи, авокадо';
      }
      if (biomarkerName.includes('глюкоза') || biomarkerName.includes('сахар')) {
        return 'Добавки: Хром пиколинат (200мкг), Берберин (500мг 3р/день), Альфа-липоевая кислота. Практики: Интервальное голодание 16:8, холодные ванны. Питание: Низкоуглеводная диета, корица';
      }
      if (biomarkerName.includes('давление') || biomarkerName.includes('систолическое')) {
        return 'Добавки: Магний (400мг), Коэнзим Q10 (100мг), Калий. Упражнения: Аэробные нагрузки, йога, дыхательные практики. Питание: DASH-диета, ограничение соли до 2г/день';
      }
      if (biomarkerName.includes('триглицериды')) {
        return 'Добавки: Омега-3 EPA/DHA (2-4г), Ниацин. Упражнения: HIIT тренировки 3р/неделя. Питание: Исключить простые углеводы, алкоголь, добавить жирную рыбу 2-3р/неделя';
      }
      if (biomarkerName.includes('мочевая кислота')) {
        return 'Добавки: Вишневый экстракт (500мг), Витамин C (500мг). Питание: Исключить пурины (субпродукты, анчоусы), ограничить алкоголь, увеличить воду до 3л/день';
      }
      if (biomarkerName.includes('креатинин')) {
        return 'Практики: Ограничить белок до 0.8г/кг веса, увеличить воду. Добавки: Избегать креатин. Упражнения: Умеренные нагрузки, избегать перетренированности';
      }
      return 'Обратитесь к врачу для коррекции показателя. Общие рекомендации: сбалансированное питание, регулярные упражнения, управление стрессом';
    }
    
    if (valueStatus.status === 'Ниже нормы') {
      if (biomarkerName.includes('гемоглобин') || biomarkerName.includes('железо')) {
        return 'Добавки: Железо бисглицинат (25мг), Витамин C (500мг для усвоения), B12, Фолиевая кислота. Питание: Красное мясо, печень, шпинат, гранат, гречка';
      }
      if (biomarkerName.includes('витамин d') || biomarkerName.includes('25-oh')) {
        return 'Добавки: Витамин D3 (2000-4000 МЕ), Магний для усвоения, K2. Практики: Солнечные ванны 15-20мин/день, фототерапия зимой';
      }
      if (biomarkerName.includes('b12') || biomarkerName.includes('кобаламин')) {
        return 'Добавки: Метилкобаламин (1000мкг сублингвально), комплекс B-витаминов. Питание: Мясо, рыба, яйца, пищевые дрожжи для веганов';
      }
      if (biomarkerName.includes('тестостерон') && biomarker.value! < 12) {
        return 'Добавки: Цинк (15мг), Витамин D3, Ашваганда (600мг), DHEA. Упражнения: Силовые тренировки, спринты. Практики: Полноценный сон 7-9ч, управление стрессом';
      }
      if (biomarkerName.includes('лпвп') || biomarkerName.includes('хороший холестерин')) {
        return 'Добавки: Ниацин (500мг), Омега-3. Упражнения: Кардио высокой интенсивности, силовые. Питание: Оливковое масло, орехи, жирная рыба, умеренное красное вино';
      }
      if (biomarkerName.includes('альбумин') || biomarkerName.includes('белок')) {
        return 'Питание: Увеличить белок до 1.2-1.6г/кг веса, полноценные аминокислоты. Добавки: Сывороточный протеин, BCAA. Упражнения: Силовые тренировки для мышечной массы';
      }
      return 'Обратитесь к врачу для выяснения причин снижения. Общие рекомендации: нутритивная поддержка, витаминно-минеральные комплексы';
    }
    
    return 'Требуется коррекция показателя. Рекомендации: комплексное обследование, персональная программа питания и тренировок, нутрицевтическая поддержка';
  };

  return (
    <div className="border border-gray-200 bg-white p-1 md:p-2">
      <div className="flex items-center justify-between mb-1 md:mb-2">
        <h4 className="text-[7px] md:text-xs font-medium text-gray-900">Введенные показатели</h4>
        <Badge variant="secondary" size="sm" className="text-[6px] md:text-xs px-1 py-0.5">
          {biomarkers.length} показателей
        </Badge>
      </div>
      
      <div className="space-y-1 md:space-y-2 max-h-80 overflow-y-auto">
        {biomarkers.map((biomarker) => {
          const valueStatus = getValueStatus(biomarker.value!, biomarker.normal_range);
          const impact = getBiomarkerImpact(biomarker.name);
          const recommendation = getRecommendationForBiomarker(biomarker);
          
          return (
            <div key={biomarker.id} className="border border-gray-100 p-1 md:p-2 bg-gray-50">
              <div className="space-y-0.5 md:space-y-1">
                {/* Заголовок с названием и статусом */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 md:gap-1">
                    <span className="text-[7px] md:text-xs font-medium text-gray-900">{biomarker.name}</span>
                    {getImpactIcon(getBiomarkerImpact(biomarker.name).impact)}
                  </div>
                  <span className={`text-[7px] md:text-xs font-medium ${valueStatus.color}`}>
                    {valueStatus.status}
                  </span>
                </div>
                
                {/* Значение и норма */}
                <div className="grid grid-cols-2 gap-1 md:gap-2 text-[7px] md:text-xs">
                  <div>
                    <span className="text-gray-600 text-[10px]">Ваш показатель:</span>
                    <div className="font-medium text-gray-900 text-[8px] md:text-sm">
                      {biomarker.value} {biomarker.unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-[10px]">Норма:</span>
                    <div className="font-medium text-gray-900 text-[8px] md:text-sm">
                      {biomarker.normal_range?.min} - {biomarker.normal_range?.max} {biomarker.unit}
                      {biomarker.normal_range?.optimal && (
                        <div className="text-green-600 text-[7px] md:text-xs">
                          (опт: {biomarker.normal_range.optimal})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Описание функции */}
                <div className="text-[7px] md:text-xs text-gray-600">
                  <span className="font-medium text-[10px]">Функция:</span> {impact.description}
                </div>
                
                {/* Рекомендации при отклонениях */}
                {recommendation && (
                  <div className="text-[7px] md:text-xs text-orange-600 bg-orange-50 p-0.5 md:p-1 rounded">
                    <span className="font-medium text-[10px]">Рекомендации по улучшению:</span> {recommendation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {biomarkers.length === 0 && (
        <div className="text-center py-2 md:py-4 text-[7px] md:text-xs text-gray-500">
          Введите показатели для получения детального анализа
        </div>
      )}
    </div>
  );
};

export default FilledBiomarkersList;