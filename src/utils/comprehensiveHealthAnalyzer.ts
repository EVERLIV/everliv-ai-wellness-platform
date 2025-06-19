
import { HealthProfileData } from '@/types/healthProfile';
import { CachedAnalytics } from '@/types/analytics';

export interface ComprehensiveRecommendation {
  id: string;
  category: 'nutrition' | 'exercise' | 'supplements' | 'lifestyle' | 'medical' | 'mental_health';
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  detailedAdvice: string[];
  scientificBasis: string;
  implementation: {
    timeline: string;
    steps: string[];
    expectedResults: string;
    monitoring: string[];
  };
  contraindications?: string[];
  cost?: string;
}

export interface AdvancedTherapy {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  protocol: string;
  duration: string;
  frequency: string;
  contraindications: string[];
  scientificEvidence: string;
  implementation: string[];
}

export interface NutritionProtocol {
  id: string;
  type: 'intermittent_fasting' | 'ketogenic' | 'mediterranean' | 'anti_inflammatory';
  name: string;
  description: string;
  benefits: string[];
  protocol: string;
  foods: {
    recommended: string[];
    avoid: string[];
    timing: string;
  };
  supplementation: string[];
  monitoring: string[];
}

export interface RecommendedTest {
  id: string;
  name: string;
  type: 'blood' | 'urine' | 'imaging' | 'functional';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  frequency: string;
  reason: string;
  expectedCost: string;
  preparation: string[];
  interpretation: string;
  nextSteps: string[];
}

export interface ComprehensiveHealthRecommendations {
  priority: ComprehensiveRecommendation[];
  therapies: AdvancedTherapy[];
  nutrition: NutritionProtocol[];
  tests: RecommendedTest[];
  supplements: {
    essential: string[];
    beneficial: string[];
    dosages: Record<string, string>;
    interactions: Record<string, string>;
  };
}

export const generateComprehensiveHealthRecommendations = (
  healthProfile?: HealthProfileData | null,
  analytics?: CachedAnalytics
): ComprehensiveHealthRecommendations => {
  const age = healthProfile?.age || 30;
  const gender = healthProfile?.gender || 'male';
  const conditions = healthProfile?.chronicConditions || [];
  const labResults = healthProfile?.labResults || {};

  // Приоритетные рекомендации
  const priorityRecommendations: ComprehensiveRecommendation[] = [
    {
      id: 'vitamin-d-optimization',
      category: 'supplements',
      title: 'Оптимизация уровня витамина D',
      priority: 'high',
      description: 'Критически важен для иммунитета, настроения и здоровья костей',
      detailedAdvice: [
        'Принимайте 2000-4000 МЕ витамина D3 ежедневно',
        'Лучшее время приема - утром с жирной пищей',
        'Комбинируйте с витамином K2 (100-200 мкг) для синергии',
        'Избегайте приема вечером - может нарушить сон'
      ],
      scientificBasis: 'Более 80% населения России имеют дефицит витамина D. Исследования показывают связь с иммунитетом, настроением и профилактикой онкологии.',
      implementation: {
        timeline: '3-6 месяцев для нормализации уровня',
        steps: [
          'Сдать анализ на 25(OH)D',
          'Начать прием согласно результатам',
          'Повторить анализ через 3 месяца',
          'Скорректировать дозировку'
        ],
        expectedResults: 'Улучшение энергии, настроения, иммунитета через 4-8 недель',
        monitoring: ['Анализ 25(OH)D каждые 3-6 месяцев', 'Самочувствие и энергия']
      },
      cost: '500-1000₽/месяц'
    },
    {
      id: 'omega-3-therapy',
      category: 'supplements',
      title: 'Высокодозная Омега-3 терапия',
      priority: 'high',
      description: 'Противовоспалительное действие, здоровье сердца и мозга',
      detailedAdvice: [
        'Принимайте 2-3г EPA+DHA ежедневно (лечебная доза)',
        'Выбирайте препараты в форме триглицеридов',
        'Принимайте с пищей для лучшего усвоения',
        'Храните в холодильнике, избегайте прогорклости'
      ],
      scientificBasis: 'Омега-3 снижают воспаление, улучшают работу мозга, защищают сердце. Соотношение Омега-6/Омега-3 у большинства людей критически нарушено.',
      implementation: {
        timeline: '2-4 месяца для достижения терапевтического эффекта',
        steps: [
          'Выбрать качественный препарат (>80% EPA+DHA)',
          'Начать с 1г/день, увеличить до 2-3г',
          'Контролировать состояние ЖКТ',
          'Сдать анализ Омега-индекса через 3 месяца'
        ],
        expectedResults: 'Снижение воспаления, улучшение когнитивных функций',
        monitoring: ['Омега-индекс каждые 6 месяцев', 'Самочувствие и настроение']
      },
      cost: '1500-3000₽/месяц'
    }
  ];

  // Продвинутые терапии
  const advancedTherapies: AdvancedTherapy[] = [
    {
      id: 'cold-therapy',
      name: 'Холодная терапия (Криотерапия)',
      description: 'Систематическое воздействие холода для улучшения здоровья и восстановления',
      benefits: [
        'Активация бурого жира и ускорение метаболизма',
        'Укрепление иммунной системы',
        'Улучшение кровообращения и лимфодренажа',
        'Снижение воспаления и боли',
        'Повышение стрессоустойчивости',
        'Улучшение качества сна',
        'Повышение уровня норадреналина и дофамина'
      ],
      protocol: 'Начните с контрастного душа, постепенно переходите к ледяным ваннам',
      duration: '2-10 минут воздействия холода',
      frequency: '3-5 раз в неделю',
      contraindications: [
        'Сердечно-сосудистые заболевания',
        'Беременность',
        'Обострение хронических заболеваний',
        'Простудные заболевания'
      ],
      scientificEvidence: 'Исследования показывают увеличение норадреналина на 530%, улучшение иммунитета и метаболизма',
      implementation: [
        'Неделя 1-2: Контрастный душ (30сек холодная вода)',
        'Неделя 3-4: Увеличить до 1-2 минут',
        'Месяц 2-3: Ледяные ванны 2-5 минут при 10-15°C',
        'Долгосрочно: Регулярная практика с постепенным усложнением'
      ]
    },
    {
      id: 'breathing-therapy',
      name: 'Дыхательные практики (Вим Хоф метод)',
      description: 'Контролируемое дыхание для активации симпатической нервной системы',
      benefits: [
        'Увеличение оксигенации тканей',
        'Активация иммунной системы',
        'Снижение стресса и тревожности',
        'Улучшение концентрации',
        'Повышение энергии',
        'Лучший контроль над эмоциями'
      ],
      protocol: '30 глубоких вдохов + задержка дыхания, 3-4 раунда',
      duration: '15-20 минут',
      frequency: 'Ежедневно утром',
      contraindications: [
        'Эпилепсия',
        'Серьезные сердечно-сосудистые заболевания',
        'Беременность',
        'Панические атаки в анамнезе'
      ],
      scientificEvidence: 'Доказано влияние на выработку адреналина, pH крови и активность иммунных клеток',
      implementation: [
        'Изучить технику безопасности',
        'Начать с 20 вдохов, увеличивать постепенно',
        'Практиковать лежа или сидя',
        'Никогда не делать в воде или за рулем'
      ]
    }
  ];

  // Протоколы питания
  const nutritionProtocols: NutritionProtocol[] = [
    {
      id: 'intermittent-fasting',
      type: 'intermittent_fasting',
      name: 'Интервальное голодание 16:8',
      description: 'Циклическое чередование периодов приема пищи и голодания',
      benefits: [
        'Активация аутофагии - клеточного очищения',
        'Улучшение чувствительности к инсулину',
        'Снижение воспаления',
        'Потеря веса без потери мышечной массы',
        'Улучшение работы мозга',
        'Увеличение продолжительности жизни'
      ],
      protocol: '16 часов голодания, 8 часов приема пищи (например, 12:00-20:00)',
      foods: {
        recommended: [
          'Авокадо, орехи, семена',
          'Жирная рыба (лосось, сардины)',
          'Листовые зеленые овощи',
          'Ягоды с низким гликемическим индексом',
          'Качественные белки (яйца, мясо grass-fed)',
          'Оливковое масло extra virgin'
        ],
        avoid: [
          'Рафинированные углеводы',
          'Сахар и сладости',
          'Обработанные продукты',
          'Трансжиры',
          'Большое количество алкоголя'
        ],
        timing: 'Первый прием пищи в 12:00, последний в 20:00'
      },
      supplementation: [
        'Электролиты во время голодания',
        'Магний перед сном',
        'Витамины группы B',
        'Пробиотики'
      ],
      monitoring: [
        'Уровень энергии',
        'Качество сна',
        'Вес и композиция тела',
        'Анализы крови (глюкоза, инсулин, воспаление)'
      ]
    }
  ];

  // Рекомендуемые анализы
  const recommendedTests: RecommendedTest[] = [
    {
      id: 'comprehensive-metabolic',
      name: 'Расширенная метаболическая панель',
      type: 'blood',
      priority: 'high',
      frequency: 'Каждые 6 месяцев',
      reason: 'Базовая оценка метаболического здоровья и выявление скрытых нарушений',
      expectedCost: '3000-5000₽',
      preparation: [
        'Голодание 12-14 часов',
        'Исключить алкоголь за 24 часа',
        'Не курить за 2 часа до сдачи',
        'Избегать физических нагрузок за день до анализа'
      ],
      interpretation: 'Оценка функции печени, почек, углеводного и липидного обмена',
      nextSteps: [
        'При отклонениях - консультация эндокринолога',
        'Коррекция диеты и образа жизни',
        'Повторный контроль через 3 месяца'
      ]
    },
    {
      id: 'inflammatory-markers',
      name: 'Маркеры воспаления',
      type: 'blood',
      priority: 'high',
      frequency: 'Каждые 6-12 месяцев',
      reason: 'Хроническое воспаление - основа большинства возрастных заболеваний',
      expectedCost: '2000-3000₽',
      preparation: [
        'Голодание 12 часов',
        'Исключить острую пищу за день',
        'Избегать интенсивных тренировок 48 часов'
      ],
      interpretation: 'СРБ <1 мг/л - оптимально, 1-3 мг/л - умеренный риск, >3 мг/л - высокий риск',
      nextSteps: [
        'При повышении - поиск источника воспаления',
        'Противовоспалительная диета',
        'Дополнительные обследования по показаниям'
      ]
    },
    {
      id: 'hormone-panel',
      name: 'Гормональная панель',
      type: 'blood',
      priority: gender === 'male' ? 'high' : 'high',
      frequency: 'Ежегодно после 30 лет',
      reason: 'Гормональный баланс критически важен для здоровья, энергии и долголетия',
      expectedCost: gender === 'male' ? '4000-6000₽' : '5000-8000₽',
      preparation: [
        'Сдача утром (7-10 часов)',
        'Для женщин - определенные дни цикла',
        'Исключить стресс и недосыпание',
        'Голодание не менее 12 часов'
      ],
      interpretation: gender === 'male' 
        ? 'Тестостерон >15 нмоль/л оптимально, оценка ГСПГ, эстрадиола'
        : 'Оценка эстрогенов, прогестерона, тестостерона в зависимости от фазы цикла',
      nextSteps: [
        'При отклонениях - консультация эндокринолога',
        'Оптимизация сна и питания',
        'Рассмотрение ЗГТ при показаниях'
      ]
    }
  ];

  return {
    priority: priorityRecommendations,
    therapies: advancedTherapies,
    nutrition: nutritionProtocols,
    tests: recommendedTests,
    supplements: {
      essential: [
        'Витамин D3 (2000-4000 МЕ)',
        'Омега-3 (2-3г EPA+DHA)',
        'Магний глицинат (300-400мг)',
        'Витамин K2 (100-200 мкг)'
      ],
      beneficial: [
        'Куркумин с пиперином',
        'Коэнзим Q10',
        'НАД+ бустеры',
        'Пробиотики',
        'Креатин моногидрат'
      ],
      dosages: {
        'Витамин D3': '2000-4000 МЕ утром с жирной пищей',
        'Омега-3': '2-3г в день с едой',
        'Магний': '300-400мг за час до сна',
        'Витамин K2': '100-200 мкг с витамином D'
      },
      interactions: {
        'Витамин D3': 'Усиливает действие при приеме с K2 и магнием',
        'Омега-3': 'Не сочетать с высокими дозами витамина E',
        'Магний': 'Может снижать усвоение некоторых антибиотиков'
      }
    }
  };
};
