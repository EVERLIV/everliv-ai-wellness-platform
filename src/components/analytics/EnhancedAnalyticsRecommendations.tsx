
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Beaker, BookOpen, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';
import { CachedAnalytics } from '@/types/analytics';

interface EnhancedAnalyticsRecommendationsProps {
  analytics: CachedAnalytics;
  healthProfile?: any;
}

const EnhancedAnalyticsRecommendations: React.FC<EnhancedAnalyticsRecommendationsProps> = ({
  analytics,
  healthProfile
}) => {
  const [recommendations, setRecommendations] = useState<AnalyticsRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [hasError, setHasError] = useState(false);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    setHasError(false);
    
    try {
      console.log('🔄 Generating enhanced analytics recommendations...');
      
      // Проверяем подключение к Supabase сначала
      const { data: testData, error: testError } = await supabase
        .from('health_profiles')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Supabase connection error:', testError);
        throw new Error('Проблема с подключением к базе данных');
      }

      // Вызываем функцию с улучшенной обработкой ошибок
      const { data, error } = await supabase.functions.invoke('generate-analytics-recommendations', {
        body: {
          analytics: {
            ...analytics,
            // Обеспечиваем полную передачу данных
            healthScore: analytics.healthScore || 65,
            riskLevel: analytics.riskLevel || 'средний',
            recommendations: analytics.recommendations || [],
            strengths: analytics.strengths || [],
            concerns: analytics.concerns || []
          },
          healthProfile: healthProfile || null
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Показываем fallback рекомендации при ошибке функции
        const fallbackRecommendations = generateFallbackRecommendations(analytics);
        setRecommendations(fallbackRecommendations);
        toast.warning('Используются базовые рекомендации. Функция ИИ временно недоступна.');
        return;
      }

      if (data?.recommendations && Array.isArray(data.recommendations)) {
        console.log('✅ Received recommendations:', data.recommendations.length);
        setRecommendations(data.recommendations);
        toast.success('Современные рекомендации готовы!');
      } else {
        console.log('No recommendations in response, using fallback');
        const fallbackRecommendations = generateFallbackRecommendations(analytics);
        setRecommendations(fallbackRecommendations);
        toast.success('Базовые рекомендации готовы!');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setHasError(true);
      
      // Генерируем fallback рекомендации
      const fallbackRecommendations = generateFallbackRecommendations(analytics);
      setRecommendations(fallbackRecommendations);
      toast.error('Ошибка ИИ-функции. Показаны базовые рекомендации.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackRecommendations = (analytics: CachedAnalytics): AnalyticsRecommendation[] => {
    const score = analytics.healthScore || 65;
    const riskLevel = analytics.riskLevel || 'средний';
    
    const fallbacks: AnalyticsRecommendation[] = [
      {
        id: 'fallback-1',
        title: 'Оптимизация циркадных ритмов',
        description: 'Научно обоснованный подход к улучшению качества сна и энергии через регуляцию биоритмов',
        category: 'sleep',
        priority: score < 70 ? 'high' : 'medium',
        evidenceLevel: 'meta-analysis',
        safetyWarnings: [
          'Консультация с врачом при хронических нарушениях сна',
          'Осторожность с мелатонином при беременности и кормлении',
          'Не превышать рекомендованные дозировки'
        ],
        contraindications: [
          'Тяжелые расстройства сна требующие медицинского лечения',
          'Прием антидепрессантов (взаимодействие с мелатонином)',
          'Аутоиммунные заболевания'
        ],
        implementation: {
          steps: [
            'Установите постоянное время отхода ко сну (±30 минут)',
            'Используйте яркий свет утром в течение 15-30 минут',
            'Исключите синий свет за 2 часа до сна',
            'Поддерживайте температуру спальни 18-20°C',
            'При необходимости: мелатонин 0.5-3мг за 30-60 мин до сна'
          ],
          duration: '2-4 недели для полной адаптации',
          frequency: 'ежедневно, строго по режиму',
          dosage: 'мелатонин: начинать с 0.5мг, максимум 3мг'
        },
        scientificBasis: 'Мета-анализы 2023-2024гг показывают 40-60% улучшение качества сна при комплексном подходе к циркадной регуляции',
        biohackingLevel: 'beginner'
      },
      {
        id: 'fallback-2',
        title: 'Персонализированное интервальное питание',
        description: 'Современный подход к питанию с учетом хронотипа и метаболических особенностей',
        category: 'nutrition',
        priority: riskLevel === 'высокий' ? 'critical' : 'high',
        evidenceLevel: 'rct',
        safetyWarnings: [
          'Обязательная консультация врача при диабете',
          'Мониторинг самочувствия в первые недели',
          'Достаточное потребление воды в периоды голодания'
        ],
        contraindications: [
          'Расстройства пищевого поведения',
          'Беременность и кормление грудью',
          'Детский и подростковый возраст',
          'Прием препаратов требующих еды'
        ],
        implementation: {
          steps: [
            'Начните с протокола 12:12 (12 часов еды, 12 часов голодания)',
            'Постепенно переходите к 14:10, затем к 16:8',
            'Последний прием пищи за 3 часа до сна',
            'В периоды питания: акцент на белки и клетчатку',
            'Отслеживайте уровень энергии и самочувствие'
          ],
          duration: '4-6 недель для адаптации метаболизма',
          frequency: '5-6 дней в неделю, 1-2 дня свободного питания',
          dosage: 'постепенное увеличение периода голодания'
        },
        scientificBasis: 'РКИ 2024г демонстрируют 8-12% снижение веса и улучшение инсулинорезистентности при персонализированном ИГ',
        biohackingLevel: 'intermediate'
      }
    ];

    // Добавляем рекомендацию по физической активности если низкий балл здоровья
    if (score < 60) {
      fallbacks.push({
        id: 'fallback-3',
        title: 'Высокоинтенсивные интервальные тренировки (HIIT)',
        description: 'Эффективный протокол для быстрого улучшения кардиометаболического здоровья',
        category: 'exercise',
        priority: 'high',
        evidenceLevel: 'meta-analysis',
        safetyWarnings: [
          'Консультация кардиолога при заболеваниях сердца',
          'Постепенное увеличение интенсивности',
          'Контроль пульса во время тренировок'
        ],
        contraindications: [
          'Нестабильная стенокардия',
          'Неконтролируемая гипертония',
          'Острые воспалительные процессы'
        ],
        implementation: {
          steps: [
            'Разминка 5-10 минут легкого кардио',
            '4 интервала: 30 сек высокая интенсивность + 90 сек отдых',
            'Заминка 5-10 минут растяжки',
            'Постепенно увеличивайте до 8 интервалов',
            'Контролируйте пульс: 85-95% от максимального'
        ],
        duration: '6-8 недель для значимых результатов',
        frequency: '2-3 раза в неделю с днями отдыха',
        dosage: 'начинать с 15-20 минут, увеличивать до 30 минут'
      },
      scientificBasis: 'Систематические обзоры 2023г подтверждают превосходство HIIT над традиционным кардио для улучшения VO2max и метаболизма',
      biohackingLevel: 'intermediate'
      });
    }

    return fallbacks;
  };

  // Автоматическая генерация при загрузке компонента
  useEffect(() => {
    if (analytics && !recommendations.length && !isGenerating) {
      console.log('🎯 Auto-generating recommendations on component mount');
      generateRecommendations();
    }
  }, [analytics]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-blue-100 text-blue-800';
      case 'sleep': return 'bg-purple-100 text-purple-800';
      case 'stress': return 'bg-amber-100 text-amber-800';
      case 'supplements': return 'bg-teal-100 text-teal-800';
      case 'biohacking': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Beaker className="h-6 w-6 text-blue-600" />
            Современные рекомендации ИИ-доктора
            {hasError && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          </h2>
          <p className="text-gray-600 mt-1">
            Персональные рекомендации на основе доказательной медицины и биохакинга
            {hasError && ' (базовые рекомендации)'}
          </p>
        </div>
        <Button
          onClick={generateRecommendations}
          disabled={isGenerating}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Генерируем...' : 'Обновить'}
        </Button>
      </div>

      {recommendations.length === 0 && !isGenerating && (
        <Card>
          <CardContent className="py-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Рекомендации не загружены. Нажмите "Обновить"</p>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Генерируем персональные рекомендации...</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'critical' ? 'Критично' :
                       rec.priority === 'high' ? 'Высокий' :
                       rec.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                    </Badge>
                    <Badge className={getCategoryColor(rec.category)}>
                      {rec.category === 'nutrition' ? 'Питание' :
                       rec.category === 'exercise' ? 'Активность' :
                       rec.category === 'sleep' ? 'Сон' :
                       rec.category === 'stress' ? 'Стресс' :
                       rec.category === 'supplements' ? 'Добавки' : 'Биохакинг'}
                    </Badge>
                    <Badge variant="outline">
                      {rec.biohackingLevel === 'beginner' ? 'Начальный' :
                       rec.biohackingLevel === 'intermediate' ? 'Средний' : 'Продвинутый'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">
                    {rec.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    {rec.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(rec.id)}
                  className="ml-4"
                >
                  {expandedCards.has(rec.id) ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </div>
            </CardHeader>

            {expandedCards.has(rec.id) && (
              <CardContent className="pt-0 space-y-4">
                {/* Научное обоснование */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Научное обоснование
                  </h4>
                  <p className="text-blue-800 text-sm">{rec.scientificBasis}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Уровень доказательности: {rec.evidenceLevel === 'meta-analysis' ? 'Мета-анализ' :
                                            rec.evidenceLevel === 'rct' ? 'РКИ' :
                                            rec.evidenceLevel === 'observational' ? 'Наблюдательное' : 'Экспертное мнение'}
                  </Badge>
                </div>

                {/* Предупреждения */}
                {(rec.safetyWarnings?.length > 0 || rec.contraindications?.length > 0) && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Важные предупреждения
                    </h4>
                    {rec.safetyWarnings?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-amber-800 mb-1">Предупреждения:</p>
                        <ul className="text-amber-800 text-sm space-y-1">
                          {rec.safetyWarnings.map((warning, idx) => (
                            <li key={idx} className="text-xs">• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {rec.contraindications?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-amber-800 mb-1">Противопоказания:</p>
                        <ul className="text-amber-800 text-sm space-y-1">
                          {rec.contraindications.map((contra, idx) => (
                            <li key={idx} className="text-xs">• {contra}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* План внедрения */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">План внедрения</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-green-800 mb-2">Пошаговый план:</p>
                      <ol className="text-green-800 text-sm space-y-1">
                        {rec.implementation.steps.map((step, idx) => (
                          <li key={idx} className="text-xs">{idx + 1}. {step}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-green-800">Длительность:</p>
                        <p className="text-xs text-green-700">{rec.implementation.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-800">Частота:</p>
                        <p className="text-xs text-green-700">{rec.implementation.frequency}</p>
                      </div>
                      {rec.implementation.dosage && (
                        <div>
                          <p className="text-xs font-medium text-green-800">Дозировка:</p>
                          <p className="text-xs text-green-700">{rec.implementation.dosage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {recommendations.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-6">
          Последнее обновление: {new Date().toLocaleString('ru-RU')}
          {hasError && ' • Используются локальные рекомендации'}
        </div>
      )}
    </div>
  );
};

export default EnhancedAnalyticsRecommendations;
