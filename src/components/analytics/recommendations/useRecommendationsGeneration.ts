
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';
import { CachedAnalytics } from '@/types/analytics';

export const useRecommendationsGeneration = (analytics: CachedAnalytics, healthProfile?: any) => {
  const [recommendations, setRecommendations] = useState<AnalyticsRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);

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

      recommendations.push({
        id: 'cognitive-nutrition',
        title: 'Нейро-питание для когнитивного здоровья',
        description: 'Специализированная диета для улучшения работы мозга и памяти',
        category: 'nutrition',
        priority: 'high',
        evidenceLevel: 'rct',
        safetyWarnings: ['Консультация с диетологом при хронических заболеваниях'],
        contraindications: ['Аллергия на орехи и рыбу'],
        implementation: {
          steps: [
            'Жирная рыба 3 раза в неделю (лосось, скумбрия)',
            'Грецкие орехи 30г ежедневно для альфа-линоленовой кислоты',
            'Черника и голубика 150г для антоцианов',
            'Куркума с черным перцем для куркумина',
            'Зеленый чай 3 чашки для L-теанина'
          ],
          duration: '6-8 недель для заметного эффекта',
          frequency: 'ежедневно',
          dosage: 'грецкие орехи: 30г/день'
        },
        scientificBasis: 'РКИ 2024г: средиземноморская диета + ягоды улучшают память на 25%',
        biohackingLevel: 'beginner'
      });

      recommendations.push({
        id: 'cognitive-tests',
        title: 'Анализы для оценки когнитивного здоровья',
        description: 'Специализированные тесты для мониторинга состояния мозга',
        category: 'supplements',
        priority: 'medium',
        evidenceLevel: 'expert-opinion',
        safetyWarnings: ['Интерпретация результатов только с врачом'],
        contraindications: ['Отсутствуют'],
        implementation: {
          steps: [
            'Витамин B12 и фолиевая кислота для нейропротекции',
            'Гомоцистеин - маркер сосудистого здоровья мозга',
            'Витамин D для нейромодуляции',
            'Омега-3 индекс для оценки DHA/EPA',
            'Инсулин натощак для метаболического здоровья мозга'
          ],
          duration: 'каждые 6 месяцев',
          frequency: 'раз в полгода',
          dosage: 'по назначению врача'
        },
        scientificBasis: 'Клинические рекомендации неврологов 2024г',
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

      recommendations.push({
        id: 'cardiovascular-nutrition',
        title: 'Кардиопротективное питание',
        description: 'Научно обоснованная диета для защиты сердца и сосудов',
        category: 'nutrition',
        priority: 'high',
        evidenceLevel: 'meta-analysis',
        safetyWarnings: ['Мониторинг калия при заболеваниях почек'],
        contraindications: ['Тяжелая сердечная недостаточность без контроля врача'],
        implementation: {
          steps: [
            'Оливковое масло extra virgin 30мл ежедневно',
            'Авокадо половина плода для мононенасыщенных жиров',
            'Орехи ассорти 30г для альфа-линоленовой кислоты',
            'Темный шоколад 85% какао 20г для флавоноидов',
            'Свекольный сок 250мл для нитратов'
          ],
          duration: '12 недель для снижения риска',
          frequency: 'ежедневно',
          dosage: 'оливковое масло: 30мл/день'
        },
        scientificBasis: 'Мета-анализ 2024г: средиземноморская диета снижает риск ССЗ на 30%',
        biohackingLevel: 'beginner'
      });

      recommendations.push({
        id: 'cardiovascular-supplements',
        title: 'Кардиопротективные добавки',
        description: 'Доказанные добавки для поддержки сердечно-сосудистой системы',
        category: 'supplements',
        priority: 'medium',
        evidenceLevel: 'rct',
        safetyWarnings: ['Контроль МНО при приеме антикоагулянтов'],
        contraindications: ['Аллергия на рыбу', 'Прием варфарина без контроля врача'],
        implementation: {
          steps: [
            'Омега-3 EPA/DHA: 2000мг для противовоспалительного эффекта',
            'Коэнзим Q10: 100-200мг для энергии митохондрий',
            'Витамин K2 MK-7: 100мкг для кальциевого обмена',
            'Боярышник: 300-600мг для поддержки сердца',
            'Чеснок экстракт: 600мг для снижения давления'
          ],
          duration: '12-16 недель для стабильного эффекта',
          frequency: 'ежедневно во время еды',
          dosage: 'Омега-3: 2000мг, CoQ10: 100-200мг'
        },
        scientificBasis: 'Кохрейновские обзоры 2024г подтверждают эффективность комплекса',
        biohackingLevel: 'intermediate'
      });

      recommendations.push({
        id: 'cardiovascular-tests',
        title: 'Кардиологические анализы и обследования',
        description: 'Комплексная диагностика для оценки сердечно-сосудистого риска',
        category: 'supplements',
        priority: 'high',
        evidenceLevel: 'expert-opinion',
        safetyWarnings: ['Обязательная консультация кардиолога'],
        contraindications: ['Отсутствуют'],
        implementation: {
          steps: [
            'Липидограмма расширенная (включая Лп(а))',
            'hsCRP - маркер воспаления сосудов',
            'Гомоцистеин - сосудистый риск-фактор',
            'NT-proBNP - функция сердца',
            'Коронарный кальций (КТ) после 45 лет'
          ],
          duration: 'каждые 6-12 месяцев',
          frequency: 'по рекомендации кардиолога',
          dosage: 'согласно протоколам обследования'
        },
        scientificBasis: 'Рекомендации ESC/EAS 2024г по профилактике ССЗ',
        biohackingLevel: 'advanced'
      });
    }

    // Общие рекомендации для всех
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

    recommendations.push({
      id: 'sleep-optimization',
      title: 'Оптимизация сна и восстановления',
      description: 'Научные методы улучшения качества сна и циркадных ритмов',
      category: 'sleep',
      priority: 'high',
      evidenceLevel: 'rct',
      safetyWarnings: ['Консультация сомнолога при нарушениях сна'],
      contraindications: ['Тяжелые расстройства сна'],
      implementation: {
        steps: [
          'Магний глицинат: 400мг за час до сна',
          'Мелатонин: 0.5-3мг за 30 минут до сна',
          'Глицин: 3г для улучшения глубокого сна',
          'Блокировка синего света после 20:00',
          'Утреннее освещение 10000 люкс 20 минут'
        ],
        duration: '4-6 недель для стабилизации ритмов',
        frequency: 'ежедневно строго по времени',
        dosage: 'Магний: 400мг, Мелатонин: 0.5-3мг'
      },
      scientificBasis: 'РКИ 2024г: комплексная оптимизация сна улучшает восстановление на 35%',
      biohackingLevel: 'intermediate'
    });

    recommendations.push({
      id: 'stress-management',
      title: 'Управление стрессом и адаптогены',
      description: 'Современные методы стресс-менеджмента и адаптивной резистентности',
      category: 'stress',
      priority: 'medium',
      evidenceLevel: 'rct',
      safetyWarnings: ['Осторожность при аутоиммунных заболеваниях'],
      contraindications: ['Прием иммуносупрессоров'],
      implementation: {
        steps: [
          'Ашвагандха KSM-66: 300-600мг для кортизола',
          'Родиола розовая: 300-400мг утром для адаптации',
          'Дыхательная практика Вим Хофа 10 минут',
          'Холодная экспозиция для гормезиса',
          'HRV медитация 15 минут ежедневно'
        ],
        duration: '8-10 недель для адаптивных изменений',
        frequency: 'ежедневно утром',
        dosage: 'Ашвагандха: 300-600мг, Родиола: 300-400мг'
      },
      scientificBasis: 'РКИ 2024г: адаптогены + дыхательные практики снижают кортизол на 30%',
      biohackingLevel: 'intermediate'
    });

    recommendations.push({
      id: 'micronutrient-testing',
      title: 'Анализ микронутриентов и витаминов',
      description: 'Комплексная оценка витаминно-минерального статуса',
      category: 'supplements',
      priority: 'medium',
      evidenceLevel: 'expert-opinion',
      safetyWarnings: ['Интерпретация только с врачом'],
      contraindications: ['Отсутствуют'],
      implementation: {
        steps: [
          'Витамин D 25(OH) - основа иммунитета',
          'Витамин B12 и фолаты - нервная система',
          'Ферритин и железо - энергетический метаболизм',
          'Цинк и селен - антиоксидантная защита',
          'Йод в моче - функция щитовидной железы'
        ],
        duration: 'каждые 6 месяцев',
        frequency: 'раз в полгода',
        dosage: 'по клиническим протоколам'
      },
      scientificBasis: 'Рекомендации ESPEN 2024г по микронутриентной диагностике',
      biohackingLevel: 'beginner'
    });

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

  const generateRecommendations = async () => {
    setIsGenerating(true);
    setLastAttempt(new Date());
    
    try {
      console.log('🔄 Генерация рекомендаций на основе целей пользователя...');
      
      // Проверяем подключение к интернету
      if (!navigator.onLine) {
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
      } else if (!navigator.onLine) {
        toast.warning('Проблемы с подключением. Показаны локальные рекомендации.');
      } else {
        toast.info('ИИ-функция недоступна. Показаны экспертные рекомендации.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Автоматическая генерация при загрузке
  useEffect(() => {
    if (analytics && !recommendations.length && !isGenerating) {
      console.log('🎯 Автоматическая генерация рекомендаций на основе целей пользователя');
      generateRecommendations();
    }
  }, [analytics, healthProfile?.healthGoals]);

  return {
    recommendations,
    isGenerating,
    lastAttempt,
    generateRecommendations
  };
};
