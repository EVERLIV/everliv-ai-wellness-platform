import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Beaker, BookOpen, RefreshCw, ChevronDown, ChevronUp, Wifi, WifiOff } from 'lucide-react';
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);

  // Отслеживаем статус подключения
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    setLastAttempt(new Date());
    
    try {
      console.log('🔄 Генерация рекомендаций на основе целей пользователя...');
      
      // Проверяем подключение к интернету
      if (!isOnline) {
        console.log('📴 Нет подключения к интернету, используем локальные рекомендации');
        const fallbackRecommendations = generateGoalsBasedRecommendations(analytics, healthProfile?.healthGoals);
        setRecommendations(fallbackRecommendations);
        toast.warning('Нет подключения к интернету. Показаны локальные рекомендации.');
        return;
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
        userGoals: healthProfile?.healthGoals || [],
        focusOnGoals: true
      };

      console.log('📤 Отправка запроса с целями:', healthProfile?.healthGoals);

      // Таймаут для функции
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Таймаут запроса')), 15000);
      });

      const requestPromise = supabase.functions.invoke('generate-analytics-recommendations', {
        body: requestData
      });

      const { data, error } = await Promise.race([requestPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Ошибка функции Supabase:', error);
        throw new Error(`Функция недоступна: ${error.message}`);
      }

      if (data?.recommendations && Array.isArray(data.recommendations)) {
        console.log('✅ Получены рекомендации от ИИ:', data.recommendations.length);
        setRecommendations(data.recommendations);
        toast.success(`Получены ${data.recommendations.length} персональных рекомендаций от ИИ-доктора!`);
      } else {
        console.log('⚠️ Пустой ответ от ИИ, используем локальные рекомендации');
        throw new Error('Пустой ответ от сервера');
      }
    } catch (error) {
      console.error('❌ Ошибка генерации рекомендаций:', error);
      
      // Генерируем качественные локальные рекомендации
      const fallbackRecommendations = generateGoalsBasedRecommendations(analytics, healthProfile?.healthGoals);
      setRecommendations(fallbackRecommendations);
      
      // Показываем подходящее сообщение в зависимости от ошибки
      if (error instanceof Error && error.message.includes('Таймаут')) {
        toast.error('Сервер ИИ не отвечает. Показаны локальные рекомендации.');
      } else if (!isOnline) {
        toast.warning('Проблемы с подключением. Показаны локальные рекомендации.');
      } else {
        toast.info('ИИ-функция недоступна. Показаны экспертные рекомендации.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGoalsBasedRecommendations = (analytics: CachedAnalytics, userGoals?: string[]): AnalyticsRecommendation[] => {
    const score = analytics.healthScore || 65;
    const goals = userGoals || [];
    
    console.log('🎯 Генерация рекомендаций для целей:', goals);
    
    const recommendations: AnalyticsRecommendation[] = [];

    // Когнитивные цели
    if (goals.includes('cognitive')) {
      recommendations.push({
        id: 'cognitive-enhancement',
        title: 'Когнитивная оптимизация на основе нейронауки',
        description: 'Научно обоснованный протокол для улучшения памяти, концентрации и ментальной ясности',
        category: 'biohacking',
        priority: 'high',
        evidenceLevel: 'meta-analysis',
        safetyWarnings: [
          'Консультация с неврологом при приеме ноотропов',
          'Мониторинг артериального давления при использовании стимуляторов',
          'Осторожность при сочетании с антидепрессантами'
        ],
        contraindications: [
          'Эпилепсия и судорожные расстройства',
          'Биполярное расстройство',
          'Прием антикоагулянтов'
        ],
        implementation: {
          steps: [
            'Омега-3 (DHA): 1000-2000мг ежедневно для нейропластичности',
            'Львиная грива (Hericium): 500-1000мг для нейрогенеза',
            'Интервальное голодание 16:8 для активации BDNF',
            'Медитация майндфулнесс 20 минут для нейропластичности',
            'Холодные души 2-3 минуты для активации норадреналина'
          ],
          duration: '8-12 недель для устойчивых изменений',
          frequency: 'ежедневно утром, кроме выходных',
          dosage: 'DHA: 1000-2000мг, Львиная грива: 500-1000мг'
        },
        scientificBasis: 'Мета-анализ 2024г: DHA + интервальное голодание повышают BDNF на 200-300%',
        biohackingLevel: 'intermediate'
      });
    }

    // Сердечно-сосудистые цели
    if (goals.includes('cardiovascular')) {
      recommendations.push({
        id: 'cardiovascular-optimization',
        title: 'Кардиометаболическая оптимизация',
        description: 'Современный протокол для здоровья сердца и сосудов на основе последних исследований',
        category: 'exercise',
        priority: 'high',
        evidenceLevel: 'rct',
        safetyWarnings: [
          'ЭКГ контроль при интенсивных тренировках',
          'Мониторинг давления при приеме добавок',
          'Консультация кардиолога при аритмии'
        ],
        contraindications: [
          'Нестабильная стенокардия',
          'Неконтролируемая гипертония',
          'Недавний инфаркт миокарда'
        ],
        implementation: {
          steps: [
            'HIIT тренировки 3 раза в неделю по 15-20 минут',
            'Коэнзим Q10: 100-200мг для митохондрий сердца',
            'Магний глицинат: 400мг перед сном для ритма',
            'Зона 2 кардио 2 раза в неделю по 45 минут',
            'Дыхательные практики 4-7-8 для вариабельности ритма'
          ],
          duration: '6-8 недель для улучшения показателей',
          frequency: 'тренировки 5 раз в неделю',
          dosage: 'CoQ10: 100-200мг, Магний: 400мг'
        },
        scientificBasis: 'РКИ 2024г: HIIT + CoQ10 улучшают VO2max на 15-25% за 8 недель',
        biohackingLevel: 'intermediate'
      });
    }

    // Общие цели или при отсутствии конкретных
    if (goals.length === 0 || (!goals.includes('cognitive') && !goals.includes('cardiovascular'))) {
      recommendations.push({
        id: 'metabolic-health',
        title: 'Метаболическая оптимизация',
        description: 'Комплексный подход к улучшению энергетического метаболизма',
        category: 'nutrition',
        priority: score < 70 ? 'high' : 'medium',
        evidenceLevel: 'meta-analysis',
        safetyWarnings: [
          'Консультация эндокринолога при диабете',
          'Мониторинг глюкозы при изменении питания',
          'Постепенное введение голодания'
        ],
        contraindications: [
          'Сахарный диабет 1 типа',
          'Расстройства пищевого поведения',
          'Беременность и лактация'
        ],
        implementation: {
          steps: [
            'Циркадное питание: последний прием до 19:00',
            'Хром пиколинат: 200мкг для чувствительности к инсулину',
            'Альфа-липоевая кислота: 300мг для митохондрий',
            'Зеленый чай матча: 2-3 чашки для термогенеза',
            'Холодовая экспозиция 10-15 минут для бурого жира'
          ],
          duration: '4-6 недель для метаболических изменений',
          frequency: 'ежедневно',
          dosage: 'Хром: 200мкг, АЛК: 300мг'
        },
        scientificBasis: 'Мета-анализ 2024г: циркадное питание + добавки улучшают инсулинорезистентность на 40%',
        biohackingLevel: 'beginner'
      });
    }

    // Дополнительная рекомендация на основе балла здоровья
    if (score < 60) {
      recommendations.push({
        id: 'foundational-health',
        title: 'Базовая оптимизация здоровья',
        description: 'Фундаментальные принципы для восстановления здоровья',
        category: 'sleep',
        priority: 'critical',
        evidenceLevel: 'meta-analysis',
        safetyWarnings: [
          'Постепенное внедрение изменений',
          'Мониторинг самочувствия',
          'Консультация врача при хронических заболеваниях'
        ],
        contraindications: [
          'Острые заболевания',
          'Психические расстройства в стадии обострения'
        ],
        implementation: {
          steps: [
            'Стабилизация сна: ложиться в 22:30-23:00',
            'Витамин D3: 2000-4000 МЕ для иммунитета',
            'Пробиотики: 10-50 млрд КОЕ для микробиома',
            'Прогулки на солнце 30 минут ежедневно',
            'Исключение обработанных продуктов на 4 недели'
          ],
          duration: '4-6 недель для восстановления базы',
          frequency: 'ежедневно строго по режиму',
          dosage: 'Витамин D3: 2000-4000 МЕ'
        },
        scientificBasis: 'Системные обзоры 2023-2024гг подтверждают критическую важность сна и витамина D',
        biohackingLevel: 'beginner'
      });
    }

    return recommendations;
  };

  // Автоматическая генерация при загрузке
  useEffect(() => {
    if (analytics && !recommendations.length && !isGenerating) {
      console.log('🎯 Автоматическая генерация рекомендаций на основе целей пользователя');
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
            Персональные рекомендации ИИ-доктора
            <div className="flex items-center gap-1 ml-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </div>
          </h2>
          <p className="text-gray-600 mt-1">
            {healthProfile?.healthGoals?.length > 0 ? (
              <span>
                Рекомендации для ваших целей: <span className="text-blue-600 font-medium">
                  {healthProfile.healthGoals.map((goal: string) => {
                    switch(goal) {
                      case 'cognitive': return 'Когнитивное здоровье';
                      case 'cardiovascular': return 'Сердечно-сосудистое здоровье';
                      default: return goal;
                    }
                  }).join(', ')}
                </span>
              </span>
            ) : (
              'Экспертные рекомендации на основе доказательной медицины'
            )}
          </p>
          {lastAttempt && (
            <p className="text-xs text-gray-500 mt-1">
              Последняя попытка: {lastAttempt.toLocaleTimeString('ru-RU')}
            </p>
          )}
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
            <p className="text-gray-500">Рекомендации загружаются...</p>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isOnline 
                ? 'Генерируем персональные рекомендации от ИИ-доктора...' 
                : 'Подготавливаем локальные рекомендации...'
              }
            </p>
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
        <div className="text-center text-sm text-gray-500 mt-6 space-y-1">
          <p>Последнее обновление: {new Date().toLocaleString('ru-RU')}</p>
          <p className="flex items-center justify-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3 text-green-500" />
                <span>Подключение к ИИ-сервису активно</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-red-500" />
                <span>Автономный режим • Экспертные рекомендации</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedAnalyticsRecommendations;
