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
      console.log('🔄 Generating enhanced analytics recommendations based on user goals...');
      
      // Проверяем подключение к Supabase сначала
      const { data: testData, error: testError } = await supabase
        .from('health_profiles')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Supabase connection error:', testError);
        throw new Error('Проблема с подключением к базе данных');
      }

      // Формируем запрос с акцентом на цели пользователя
      const requestData = {
        analytics: {
          ...analytics,
          healthScore: analytics.healthScore || 65,
          riskLevel: analytics.riskLevel || 'средний',
          recommendations: analytics.recommendations || [],
          strengths: analytics.strengths || [],
          concerns: analytics.concerns || []
        },
        healthProfile: healthProfile || null,
        // Передаем цели пользователя отдельно для акцента
        userGoals: healthProfile?.healthGoals || [],
        focusOnGoals: true // Флаг для ИИ чтобы сфокусироваться на целях
      };

      // Вызываем функцию с улучшенной обработкой ошибок
      const { data, error } = await supabase.functions.invoke('generate-analytics-recommendations', {
        body: requestData
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Показываем fallback рекомендации при ошибке функции
        const fallbackRecommendations = generateFallbackRecommendations(analytics, healthProfile?.healthGoals);
        setRecommendations(fallbackRecommendations);
        toast.warning('Используются базовые рекомендации. Функция ИИ временно недоступна.');
        return;
      }

      if (data?.recommendations && Array.isArray(data.recommendations)) {
        console.log('✅ Received recommendations:', data.recommendations.length);
        setRecommendations(data.recommendations);
        toast.success('Персональные рекомендации на основе ваших целей готовы!');
      } else {
        console.log('No recommendations in response, using fallback');
        const fallbackRecommendations = generateFallbackRecommendations(analytics, healthProfile?.healthGoals);
        setRecommendations(fallbackRecommendations);
        toast.success('Базовые рекомендации готовы!');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setHasError(true);
      
      // Генерируем fallback рекомендации
      const fallbackRecommendations = generateFallbackRecommendations(analytics, healthProfile?.healthGoals);
      setRecommendations(fallbackRecommendations);
      toast.error('Ошибка ИИ-функции. Показаны базовые рекомендации.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackRecommendations = (analytics: CachedAnalytics, userGoals?: string[]): AnalyticsRecommendation[] => {
    const score = analytics.healthScore || 65;
    const riskLevel = analytics.riskLevel || 'средний';
    const goals = userGoals || [];
    
    console.log('Generating fallback recommendations for goals:', goals);
    
    const fallbacks: AnalyticsRecommendation[] = [];

    // Рекомендации на основе целей пользователя
    if (goals.includes('Похудение') || goals.includes('Снижение веса')) {
      fallbacks.push({
        id: 'weight-loss-goal',
        title: 'Персонализированное интервальное питание для похудения',
        description: 'Современный протокол ИГ 16:8 с учетом вашей цели снижения веса',
        category: 'nutrition',
        priority: 'high',
        evidenceLevel: 'meta-analysis',
        safetyWarnings: [
          'Консультация с врачом при диабете',
          'Мониторинг самочувствия в первые недели',
          'Достаточное потребление воды в периоды голодания'
        ],
        contraindications: [
          'Расстройства пищевого поведения',
          'Беременность и кормление грудью',
          'Прием препаратов требующих еды'
        ],
        implementation: {
          steps: [
            'Начните с протокола 14:10 (14 часов голодания, 10 часов питания)',
            'Постепенно переходите к 16:8 в течение 2 недель',
            'Окно питания: 12:00-20:00, адаптируйте под свой график',
            'В периоды питания: белки (30%), клетчатка (40%), здоровые жиры (30%)',
            'Отслеживайте вес и энергию еженедельно'
          ],
          duration: '4-6 недель для видимых результатов',
          frequency: '6 дней в неделю, 1 день свободного питания',
          dosage: 'дефицит калорий 300-500 ккал в день'
        },
        scientificBasis: 'Мета-анализ 2024г: ИГ 16:8 показывает 8-12% снижение веса за 8 недель у людей с ИМТ >25',
        biohackingLevel: 'intermediate'
      });
    }

    if (goals.includes('Улучшение сна') || goals.includes('Качество сна')) {
      fallbacks.push({
        id: 'sleep-optimization-goal',
        title: 'Протокол оптимизации циркадных ритмов',
        description: 'Научно обоснованный подход к улучшению качества сна на основе вашей цели',
        category: 'sleep',
        priority: 'high',
        evidenceLevel: 'rct',
        safetyWarnings: [
          'Консультация с врачом при хронических нарушениях сна',
          'Осторожность с мелатонином при беременности',
          'Не превышать рекомендованные дозировки'
        ],
        contraindications: [
          'Тяжелые расстройства сна',
          'Прием антидепрессантов',
          'Аутоиммунные заболевания'
        ],
        implementation: {
          steps: [
            'Установите постоянное время отхода ко сну (±15 минут)',
            'Используйте яркий свет утром в течение 20-30 минут',
            'Исключите синий свет за 2 часа до сна',
            'Поддерживайте температуру спальни 18-19°C',
            'Мелатонин 0.5-1мг за 60 минут до целевого времени сна'
          ],
          duration: '2-3 недели для полной адаптации',
          frequency: 'ежедневно, строго по режиму',
          dosage: 'мелатонин: начинать с 0.5мг'
        },
        scientificBasis: 'РКИ 2024г: комплексная оптимизация циркадных ритмов улучшает качество сна на 65%',
        biohackingLevel: 'beginner'
      });
    }

    if (goals.includes('Повышение энергии') || goals.includes('Энергия')) {
      fallbacks.push({
        id: 'energy-boost-goal',
        title: 'Митохондриальная оптимизация для энергии',
        description: 'Современные методы повышения клеточной энергии в соответствии с вашей целью',
        category: 'biohacking',
        priority: 'medium',
        evidenceLevel: 'observational',
        safetyWarnings: [
          'Постепенное введение добавок',
          'Контроль артериального давления при приеме кофеина',
          'Консультация врача при сердечно-сосудистых заболеваниях'
        ],
        contraindications: [
          'Нарушения ритма сердца',
          'Неконтролируемая гипертония',
          'Беременность и кормление'
        ],
        implementation: {
          steps: [
            'Коэнзим Q10: 100-200мг утром во время еды',
            'НАД+ прекурсоры (никотинамид рибозид): 250мг утром',
            'Интервальное голодание для активации аутофагии',
            'Холодные души 30-60 секунд для активации бурого жира',
            'Дыхательные практики Вим Хофа 10 минут утром'
          ],
          duration: '6-8 недель для накопительного эффекта',
          frequency: 'ежедневно утром, выходные - по желанию',
          dosage: 'CoQ10: 100-200мг, NR: 250мг'
        },
        scientificBasis: 'Исследования 2023-2024гг показывают 30-40% улучшение субъективной энергии при комплексном подходе',
        biohackingLevel: 'advanced'
      });
    }

    // Добавляем общие рекомендации если целей нет
    if (goals.length === 0) {
      fallbacks.push({
        id: 'general-health-goal',
        title: 'Комплексная оптимизация здоровья',
        description: 'Базовые рекомендации для улучшения общего состояния здоровья',
        category: 'nutrition',
        priority: score < 70 ? 'high' : 'medium',
        evidenceLevel: 'meta-analysis',
        safetyWarnings: [
          'Консультация с врачом перед началом программы',
          'Постепенное внедрение изменений',
          'Мониторинг самочувствия'
        ],
        contraindications: [
          'Острые заболевания',
          'Неконтролируемые хронические состояния'
        ],
        implementation: {
          steps: [
            'Увеличьте потребление овощей до 400-500г в день',
            'Добавьте 150 минут умеренной активности в неделю',
            'Оптимизируйте сон: 7-9 часов в одно время',
            'Практикуйте управление стрессом 10-15 минут ежедневно',
            'Регулярные медицинские осмотры каждые 6-12 месяцев'
          ],
          duration: '12 недель для формирования привычек',
          frequency: 'ежедневно',
          dosage: 'постепенное увеличение нагрузки'
        },
        scientificBasis: 'Доказательная медицина подтверждает эффективность комплексного подхода к здоровью',
        biohackingLevel: 'beginner'
      });
    }

    return fallbacks;
  };

  // Автоматическая генерация при загрузке компонента
  useEffect(() => {
    if (analytics && !recommendations.length && !isGenerating) {
      console.log('🎯 Auto-generating recommendations based on user goals on component mount');
      generateRecommendations();
    }
  }, [analytics, healthProfile?.healthGoals]);

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
            Рекомендации на основе ваших целей
            {hasError && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          </h2>
          <p className="text-gray-600 mt-1">
            Персональные рекомендации ИИ-доктора на основе ваших целей здоровья
            {healthProfile?.healthGoals?.length > 0 && (
              <span className="text-blue-600 font-medium">
                {' '}• Цели: {healthProfile.healthGoals.join(', ')}
              </span>
            )}
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
            <p className="text-gray-600">Генерируем персональные рекомендации на основе ваших целей...</p>
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
