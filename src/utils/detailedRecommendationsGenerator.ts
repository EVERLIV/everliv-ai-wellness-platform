
import { CachedAnalytics } from '@/types/analytics';
import { translateValue } from '@/utils/healthProfileTranslations';

interface HealthProfileData {
  smokingStatus?: string;
  alcoholConsumption?: string;
  physicalActivity?: string;
  dietType?: string;
  sleepQuality?: string;
  moodChanges?: string;
  height?: number;
  weight?: number;
  age?: number;
  medicalConditions?: string[];
  medications?: string[];
  allergies?: string[];
}

export const generateDetailedRecommendations = (analytics: CachedAnalytics, healthProfile?: HealthProfileData) => {
  const bmi = healthProfile?.height && healthProfile?.weight 
    ? (healthProfile.weight / Math.pow(healthProfile.height / 100, 2)).toFixed(1)
    : null;

  const isNonSmoker = healthProfile?.smokingStatus === 'never';
  const isLightDrinker = healthProfile?.alcoholConsumption === 'never' || healthProfile?.alcoholConsumption === 'rarely';
  const isActiveLifestyle = healthProfile?.physicalActivity === 'active' || healthProfile?.physicalActivity === 'very_active';
  const hasGoodSleep = healthProfile?.sleepQuality === 'good' || healthProfile?.sleepQuality === 'excellent';
  
  // Базовые рекомендации, адаптированные под профиль
  const recommendations = [
    {
      id: 'vitamin-d-boost',
      category: 'Витамины и микроэлементы',
      title: 'Нормализация уровня витамина D',
      priority: 'high' as const,
      description: 'Низкий уровень витамина D влияет на иммунитет, настроение и здоровье костей',
      specificActions: [
        '1. Принимайте 2000-4000 МЕ витамина D3 ежедневно утром во время еды',
        '2. Проводите 15-30 минут на солнце ежедневно (11:00-15:00)',
        '3. Включите в рацион жирную рыбу 2-3 раза в неделю',
        '4. Контролируйте уровень каждые 3 месяца',
        '5. При достижении нормы (30-50 нг/мл) снизьте дозу до 1000-2000 МЕ'
      ],
      expectedResult: 'Улучшение иммунитета, энергии, настроения через 2-3 месяца',
      timeframe: '3-6 месяцев до нормализации',
      cost: '500-800 руб/месяц'
    },
    {
      id: 'cholesterol-management',
      category: 'Сердечно-сосудистая система',
      title: 'Снижение уровня холестерина',
      priority: 'high' as const,
      description: 'Повышенный холестерин увеличивает риск сердечно-сосудистых заболеваний',
      specificActions: [
        '1. Исключите трансжиры полностью (маргарин, фастфуд)',
        '2. Ограничьте насыщенные жиры до 10% от калорийности',
        '3. Употребляйте 25-30г клетчатки ежедневно (овощи, фрукты, цельнозерновые)',
        '4. Добавьте 30г орехов в день (грецкие, миндаль)',
        '5. Готовьте на оливковом масле extra virgin',
        isActiveLifestyle 
          ? '6. Продолжайте текущий уровень физической активности'
          : '6. Кардио тренировки 150 минут в неделю средней интенсивности'
      ],
      expectedResult: 'Снижение общего холестерина на 10-15% через 2-3 месяца',
      timeframe: '2-4 месяца',
      cost: 'Без дополнительных затрат (изменение рациона)'
    },
    {
      id: 'stress-management',
      category: 'Психическое здоровье',
      title: 'Управление стрессом и сном',
      priority: hasGoodSleep ? 'low' as const : 'medium' as const,
      description: hasGoodSleep 
        ? 'Поддержание хорошего качества сна и дальнейшее улучшение стрессоустойчивости'
        : 'Хронический стресс влияет на все системы организма',
      specificActions: hasGoodSleep ? [
        '1. Продолжайте соблюдать режим сна',
        '2. Практикуйте медитацию 10-15 минут ежедневно для профилактики стресса',
        '3. Поддерживайте ритуал перед сном',
        '4. Практикуйте дыхательные упражнения при стрессе (4-7-8)'
      ] : [
        '1. Практикуйте медитацию 10-15 минут ежедневно (приложение Headspace или Calm)',
        '2. Ложитесь спать в одно время (22:00-23:00)',
        '3. Откажитесь от экранов за 1 час до сна',
        '4. Создайте ритуал перед сном (чтение, легкая растяжка)',
        '5. Поддерживайте температуру в спальне 18-20°C',
        '6. Практикуйте дыхательные упражнения при стрессе (4-7-8)'
      ],
      expectedResult: hasGoodSleep 
        ? 'Поддержание отличного качества сна и повышение стрессоустойчивости'
        : 'Улучшение качества сна и стрессоустойчивости через 2-4 недели',
      timeframe: '1-2 месяца',
      cost: '300-500 руб/месяц (приложения для медитации)'
    }
  ];

  // Адаптируем факторы риска под профиль
  const riskFactors = [
    {
      id: 'cardiovascular-risk',
      factor: 'Риск сердечно-сосудистых заболеваний',
      level: (isNonSmoker && isLightDrinker && isActiveLifestyle) ? 'low' as const : 'medium' as const,
      description: isNonSmoker && isLightDrinker 
        ? 'Низкий базовый риск благодаря отсутствию курения и умеренному потреблению алкоголя'
        : 'Сочетание повышенного холестерина и образа жизни',
      currentImpact: (isNonSmoker && isLightDrinker && isActiveLifestyle)
        ? 'Минимальный дополнительный риск при соблюдении рекомендаций'
        : 'Увеличенный риск инфаркта и инсульта в 1.5-2 раза',
      mitigation: [
        isActiveLifestyle 
          ? 'Поддерживайте текущий уровень физической активности'
          : 'Кардио тренировки 150 минут в неделю',
        'Средиземноморская диета',
        'Контроль артериального давления ежедневно',
        ...(isNonSmoker ? [] : ['Отказ от курения']),
        isLightDrinker 
          ? 'Продолжайте умеренное потребление алкоголя'
          : 'Ограничение алкоголя до 1-2 порций в неделю'
      ],
      monitoringFrequency: 'Липидный профиль каждые 3 месяца, ЭКГ раз в год'
    },
    {
      id: 'metabolic-syndrome',
      factor: 'Предрасположенность к метаболическому синдрому',
      level: bmi && parseFloat(bmi) > 25 ? 'medium' as const : 'low' as const,
      description: bmi 
        ? `При ИМТ ${bmi} ${parseFloat(bmi) > 25 ? 'рекомендуется контроль веса' : 'вес в норме'}`
        : 'Небольшое превышение нормы глюкозы натощак',
      currentImpact: 'Повышенный риск развития диабета 2 типа',
      mitigation: [
        'Снижение потребления простых углеводов',
        isActiveLifestyle 
          ? 'Поддерживайте текущий уровень физической активности'
          : 'Регулярные физические нагрузки',
        bmi && parseFloat(bmi) > 25 
          ? 'Снижение веса до ИМТ 18.5-24.9'
          : 'Поддержание текущего веса (ИМТ в норме)',
        'Увеличение потребления клетчатки'
      ],
      monitoringFrequency: 'Глюкоза натощак каждые 6 месяцев, HbA1c раз в год'
    }
  ];

  // Персонализированные добавки с учетом аллергий
  const supplements = [
    {
      id: 'vitamin-d3',
      name: 'Витамин D3 (холекальциферол)',
      dosage: '2000-4000 МЕ',
      timing: 'Утром во время завтрака с жирами',
      benefit: 'Укрепляет иммунитет, улучшает настроение, здоровье костей',
      duration: '3-6 месяцев до нормализации, далее поддерживающая доза',
      cost: '400-600 руб/месяц',
      whereToBuy: 'Аптеки, iHerb, Solgar, Now Foods',
      interactions: 'Увеличивает всасывание кальция',
      sideEffects: 'При превышении дозы: тошнота, камни в почках'
    },
    {
      id: 'omega-3',
      name: 'Омега-3 (EPA/DHA)',
      dosage: '1000-2000 мг в день',
      timing: 'Во время еды, желательно вечером',
      benefit: 'Снижает воспаление, улучшает работу сердца и мозга',
      duration: 'Постоянно',
      cost: '800-1200 руб/месяц',
      whereToBuy: healthProfile?.allergies?.includes('рыба') || healthProfile?.allergies?.includes('морепродукты')
        ? 'Веганская омега-3 из водорослей (Algae Omega, V-Omega 3)'
        : 'Nordic Naturals, Solgar, аптеки',
      interactions: 'Разжижает кровь, осторожно с антикоагулянтами',
      sideEffects: healthProfile?.allergies?.includes('рыба') 
        ? 'При аллергии на рыбу используйте веганские варианты'
        : 'Рыбный запах изо рта, расстройство желудка'
    },
    {
      id: 'magnesium',
      name: 'Магний (глицинат)',
      dosage: '200-400 мг',
      timing: hasGoodSleep ? 'Вечером для поддержания качества сна' : 'Вечером за час до сна',
      benefit: hasGoodSleep 
        ? 'Поддерживает хорошее качество сна, снижает стресс'
        : 'Улучшает сон, снижает стресс, расслабляет мышцы',
      duration: '2-3 месяца, затем перерыв',
      cost: '300-500 руб/месяц',
      whereToBuy: 'Now Foods, Solgar, аптеки',
      interactions: 'Может снижать всасывание некоторых антибиотиков',
      sideEffects: 'Расслабление кишечника при превышении дозы'
    }
  ];

  const specialists = [
    {
      id: 'cardiologist',
      specialist: 'Кардиолог',
      urgency: (isNonSmoker && isLightDrinker && isActiveLifestyle) 
        ? 'within_3_months' as const 
        : 'within_month' as const,
      reason: 'Оценка сердечно-сосудистого риска при повышенном холестерине',
      whatToExpected: 'ЭКГ, эхокардиография, расчет риска SCORE, назначение статинов при необходимости',
      preparation: [
        'Принесите результаты липидного профиля',
        'Измерьте давление дома 7 дней подряд',
        'Подготовьте список принимаемых препаратов',
        'Не пейте кофе за 2 часа до приема'
      ],
      estimatedCost: '2000-3500 руб за консультацию',
      frequency: (isNonSmoker && isLightDrinker) 
        ? 'Раз в год для профилактики при низком риске'
        : 'Раз в 6 месяцев при наличии факторов риска'
    },
    {
      id: 'endocrinologist',
      specialist: 'Эндокринолог',
      urgency: 'within_3_months' as const,
      reason: 'Профилактика метаболических нарушений',
      whatToExpected: 'Оценка углеводного обмена, функции щитовидной железы, рекомендации по питанию',
      preparation: [
        'Анализы натощак: глюкоза, HbA1c, ТТГ, Т4 свободный',
        'Ведите дневник питания 7 дней',
        'Измерьте обхват талии',
        'Подготовьте семейный анамнез по диабету'
      ],
      estimatedCost: '2500-4000 руб за консультацию',
      frequency: 'Раз в год для профилактики'
    },
    {
      id: 'nutritionist',
      specialist: 'Диетолог-нутрициолог',
      urgency: 'within_month' as const,
      reason: healthProfile?.dietType 
        ? `Оптимизация ${translateValue('dietType', healthProfile.dietType).toLowerCase()} питания`
        : 'Составление индивидуального плана питания',
      whatToExpected: 'Анализ текущего рациона, расчет КБЖУ, план питания, рекомендации по добавкам',
      preparation: [
        'Ведите дневник питания 7 дней',
        'Принесите результаты анализов',
        'Подготовьте список любимых и нелюбимых продуктов',
        healthProfile?.allergies?.length 
          ? `Составьте полный список аллергий: ${healthProfile.allergies.join(', ')}`
          : 'Опишите пищевые аллергии и непереносимости',
        'Опишите режим дня и физической активности'
      ],
      estimatedCost: '3000-5000 руб за консультацию',
      frequency: 'Каждые 3 месяца в начале, затем раз в полгода'
    }
  ];

  const tests = [
    {
      id: 'comprehensive-metabolic',
      testName: 'Расширенный биохимический анализ',
      priority: 'high' as const,
      frequency: 'Каждые 3 месяца',
      reason: 'Контроль метаболических показателей и эффективности рекомендаций',
      preparation: [
        'Голодание 12-14 часов',
        isNonSmoker ? 'Не употребляйте кофеин за 2 часа до анализа' : 'Не курить 2 часа до анализа',
        isLightDrinker ? 'Исключить алкоголь за 24 часа (если употребляете)' : 'Исключить алкоголь за 24 часа',
        'Не принимать витамины утром в день анализа'
      ],
      expectedCost: '2000-3000 руб',
      whereToGet: 'Инвитро, Гемотест, KDL, поликлиника',
      whatItChecks: [
        'Глюкоза натощак',
        'Липидный профиль (общий холестерин, ЛПНП, ЛПВП, ТГ)',
        'Печеночные ферменты (АЛТ, АСТ)',
        'Функция почек (креатинин, мочевина)',
        'Электролиты (Na, K, Cl)',
        'Общий белок и альбумин'
      ]
    },
    {
      id: 'vitamin-d-test',
      testName: '25-OH витамин D',
      priority: 'high' as const,
      frequency: 'Каждые 3 месяца до нормализации, затем каждые 6 месяцев',
      reason: 'Контроль эффективности приема витамина D и корректировка дозы',
      preparation: [
        'Можно сдавать в любое время дня',
        'Не прекращать прием витамина D',
        'Принести информацию о текущей дозировке'
      ],
      expectedCost: '800-1200 руб',
      whereToGet: 'Любая лаборатория',
      whatItChecks: [
        'Уровень 25-гидроксивитамина D',
        'Оценка статуса витамина D в организме'
      ]
    },
    {
      id: 'thyroid-function',
      testName: 'Функция щитовидной железы',
      priority: 'medium' as const,
      frequency: 'Раз в год',
      reason: 'Исключение нарушений щитовидной железы как причины усталости и метаболических нарушений',
      preparation: [
        'Сдавать утром натощак',
        'За месяц отменить препараты йода (если принимаете)',
        'Исключить стресс в день анализа'
      ],
      expectedCost: '1500-2000 руб',
      whereToGet: 'Инвитро, Гемотест, KDL',
      whatItChecks: [
        'ТТГ (тиреотропный гормон)',
        'Т4 свободный',
        'Т3 свободный (по показаниям)',
        'Антитела к ТПО (при подозрении на аутоиммунный тиреоидит)'
      ]
    },
    {
      id: 'inflammation-markers',
      testName: 'Маркеры воспаления',
      priority: 'medium' as const,
      frequency: 'Каждые 6 месяцев',
      reason: 'Оценка уровня хронического воспаления в организме',
      preparation: [
        'Сдавать утром натощак',
        'Исключить острые инфекции за 2 недели',
        'Не принимать противовоспалительные препараты за 3 дня'
      ],
      expectedCost: '800-1500 руб',
      whereToGet: 'Любая лаборатория',
      whatItChecks: [
        'С-реактивный белок высокочувствительный',
        'СОЭ',
        'Гомоцистеин',
        'Ферритин'
      ]
    }
  ];

  return {
    recommendations,
    riskFactors,
    supplements,
    specialists,
    tests
  };
};
