
import { CachedAnalytics } from '@/types/analytics';
import { HealthProfileData } from '@/hooks/useHealthProfile';

interface DetailedRecommendation {
  id: string;
  category: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  specificActions: string[];
  expectedResult: string;
  timeframe: string;
  cost?: string;
}

interface RiskFactor {
  id: string;
  factor: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  currentImpact: string;
  mitigation: string[];
  monitoringFrequency: string;
}

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  benefit: string;
  duration: string;
  cost: string;
  whereToBuy: string;
  interactions?: string;
  sideEffects?: string;
}

interface SpecialistRecommendation {
  id: string;
  specialist: string;
  urgency: 'immediate' | 'within_month' | 'within_3_months' | 'annual';
  reason: string;
  whatToExpected: string;
  preparation: string[];
  estimatedCost: string;
  frequency: string;
}

interface TestRecommendation {
  id: string;
  testName: string;
  priority: 'high' | 'medium' | 'low';
  frequency: string;
  reason: string;
  preparation: string[];
  expectedCost: string;
  whereToGet: string;
  whatItChecks: string[];
}

export const generateDetailedRecommendations = (
  analytics: CachedAnalytics,
  healthProfile?: HealthProfileData
) => {
  const recommendations: DetailedRecommendation[] = [];
  const riskFactors: RiskFactor[] = [];
  const supplements: Supplement[] = [];
  const specialists: SpecialistRecommendation[] = [];
  const tests: TestRecommendation[] = [];

  if (!healthProfile) {
    // Базовые рекомендации без профиля
    riskFactors.push({
      id: 'no-profile',
      factor: 'Отсутствие профиля здоровья',
      level: 'medium',
      description: 'Для точной оценки рисков необходимо заполнить профиль здоровья',
      currentImpact: 'Невозможность персонализированной оценки',
      mitigation: ['Заполните профиль здоровья', 'Загрузите результаты анализов'],
      monitoringFrequency: 'Единоразово'
    });

    specialists.push({
      id: 'general-checkup',
      specialist: 'Терапевт',
      urgency: 'annual',
      reason: 'Общий профилактический осмотр',
      whatToExpected: 'Базовое обследование, измерение давления, веса',
      preparation: ['Подготовьте список симптомов'],
      estimatedCost: '1500-3000₽',
      frequency: 'Ежегодно'
    });

    return { recommendations, riskFactors, supplements, specialists, tests };
  }

  // Факторы риска на основе курения
  if (healthProfile.smokingStatus === 'regular' || healthProfile.smokingStatus === 'occasional') {
    riskFactors.push({
      id: 'smoking-risk',
      factor: 'Курение',
      level: 'high',
      description: 'Курение значительно повышает риск сердечно-сосудистых заболеваний, рака и других патологий',
      currentImpact: 'Повышенный риск инфаркта, инсульта, рака легких, ХОБЛ',
      mitigation: [
        'Постепенное снижение количества сигарет',
        'Никотинозаместительная терапия',
        'Консультация нарколога',
        'Поведенческая терапия'
      ],
      monitoringFrequency: 'Еженедельный контроль прогресса'
    });

    specialists.push({
      id: 'addiction-specialist',
      specialist: 'Нарколог',
      urgency: 'within_month',
      reason: 'Помощь в отказе от курения',
      whatToExpected: 'Оценка зависимости, план отказа от курения, назначение препаратов',
      preparation: ['Подсчитайте количество выкуриваемых сигарет в день', 'Определите триггеры курения'],
      estimatedCost: '2000-5000₽',
      frequency: 'Еженедельно в течение 1-2 месяцев'
    });
  }

  // Факторы риска на основе физической активности
  if (healthProfile.physicalActivity === 'sedentary' || healthProfile.exerciseFrequency < 2) {
    riskFactors.push({
      id: 'sedentary-lifestyle',
      factor: 'Малоподвижный образ жизни',
      level: 'medium',
      description: 'Недостаток физической активности повышает риск ожирения, диабета, сердечно-сосудистых заболеваний',
      currentImpact: 'Снижение мышечной массы, замедление метаболизма, повышенный риск депрессии',
      mitigation: [
        'Ежедневные прогулки минимум 30 минут',
        'Силовые тренировки 2 раза в неделю',
        'Использование лестницы вместо лифта',
        'Перерывы на движение каждый час'
      ],
      monitoringFrequency: 'Еженедельная оценка активности'
    });

    specialists.push({
      id: 'sports-medicine',
      specialist: 'Врач спортивной медицины',
      urgency: 'within_3_months',
      reason: 'Составление программы физических нагрузок',
      whatToExpected: 'Оценка физического состояния, составление индивидуальной программы тренировок',
      preparation: ['Пройдите ЭКГ', 'Подготовьте информацию о травмах'],
      estimatedCost: '3000-7000₽',
      frequency: 'Раз в 3-6 месяцев'
    });
  }

  // Факторы риска на основе питания
  if (healthProfile.alcoholConsumption === 'heavy' || healthProfile.waterIntake < 4) {
    riskFactors.push({
      id: 'poor-nutrition',
      factor: 'Неправильное питание и гидратация',
      level: healthProfile.alcoholConsumption === 'heavy' ? 'high' : 'medium',
      description: 'Недостаточное потребление воды и чрезмерное употребление алкоголя влияет на все системы организма',
      currentImpact: 'Нарушение обмена веществ, перегрузка печени, обезвоживание',
      mitigation: [
        'Увеличить потребление воды до 8 стаканов в день',
        'Ограничить алкоголь до рекомендованных норм',
        'Консультация диетолога',
        'Ведение дневника питания'
      ],
      monitoringFrequency: 'Ежедневный контроль потребления воды'
    });

    if (healthProfile.alcoholConsumption === 'heavy') {
      specialists.push({
        id: 'hepatologist',
        specialist: 'Гепатолог',
        urgency: 'within_month',
        reason: 'Оценка состояния печени при частом употреблении алкоголя',
        whatToExpected: 'УЗИ печени, биохимические анализы, консультация по снижению употребления алкоголя',
        preparation: ['Исключить алкоголь за 3 дня до визита', 'Подготовить информацию о количестве употребляемого алкоголя'],
        estimatedCost: '4000-8000₽',
        frequency: 'Раз в 6 месяцев'
      });
    }
  }

  // Факторы риска на основе сна и стресса
  if (healthProfile.sleepHours < 7 || healthProfile.stressLevel > 6) {
    riskFactors.push({
      id: 'stress-sleep',
      factor: 'Хронический стресс и недостаток сна',
      level: 'high',
      description: 'Хронический стресс и недосыпание ослабляют иммунитет и повышают риск многих заболеваний',
      currentImpact: 'Повышенный кортизол, снижение иммунитета, риск депрессии и тревожности',
      mitigation: [
        'Нормализация режима сна (7-9 часов)',
        'Техники управления стрессом',
        'Медитация и дыхательные упражнения',
        'Ограничение кофеина после 15:00'
      ],
      monitoringFrequency: 'Ежедневное отслеживание сна и уровня стресса'
    });

    specialists.push({
      id: 'psychologist',
      specialist: 'Психолог/Психотерапевт',
      urgency: 'within_month',
      reason: 'Работа с хроническим стрессом и улучшение качества сна',
      whatToExpected: 'Оценка психического состояния, обучение техникам релаксации',
      preparation: ['Ведите дневник сна в течение недели', 'Составьте список основных стрессоров'],
      estimatedCost: '3000-8000₽ за сеанс',
      frequency: 'Еженедельно в течение 2-3 месяцев'
    });
  }

  // Рекомендации на основе возраста
  if (healthProfile.age > 40) {
    riskFactors.push({
      id: 'age-related',
      factor: 'Возрастные изменения',
      level: 'medium',
      description: 'После 40 лет повышается риск сердечно-сосудистых заболеваний и других возрастных патологий',
      currentImpact: 'Замедление метаболизма, снижение мышечной массы, гормональные изменения',
      mitigation: [
        'Регулярные профилактические обследования',
        'Контроль гормонального статуса',
        'Силовые тренировки для сохранения мышечной массы',
        'Профилактика остеопороза'
      ],
      monitoringFrequency: 'Ежегодное комплексное обследование'
    });

    specialists.push({
      id: 'cardiologist',
      specialist: 'Кардиолог',
      urgency: 'annual',
      reason: 'Профилактика сердечно-сосудистых заболеваний',
      whatToExpected: 'ЭКГ, ЭхоКГ, оценка сердечно-сосудистых рисков',
      preparation: ['Результаты биохимического анализа крови', 'Измерения давления за неделю'],
      estimatedCost: '3000-6000₽',
      frequency: 'Ежегодно после 40 лет'
    });

    specialists.push({
      id: 'endocrinologist',
      specialist: 'Эндокринолог',
      urgency: 'annual',
      reason: 'Контроль гормонального статуса и профилактика диабета',
      whatToExpected: 'Анализы на гормоны, глюкозу, оценка функции щитовидной железы',
      preparation: ['Сдать анализы на гормоны щитовидной железы', 'Глюкоза натощак'],
      estimatedCost: '2500-5000₽',
      frequency: 'Ежегодно'
    });
  }

  // Гендерно-специфичные рекомендации
  if (healthProfile.gender === 'female' && healthProfile.age > 35) {
    specialists.push({
      id: 'gynecologist',
      specialist: 'Гинеколог',
      urgency: 'annual',
      reason: 'Профилактические осмотры женского здоровья',
      whatToExpected: 'Осмотр, цитология, УЗИ органов малого таза',
      preparation: ['Гигиена перед визитом', 'Календарь менструального цикла'],
      estimatedCost: '2000-4000₽',
      frequency: 'Ежегодно'
    });
  }

  if (healthProfile.gender === 'male' && healthProfile.age > 45) {
    specialists.push({
      id: 'urologist',
      specialist: 'Уролог',
      urgency: 'annual',
      reason: 'Профилактика заболеваний мужской репродуктивной системы',
      whatToExpected: 'Осмотр, анализ на ПСА, УЗИ предстательной железы',
      preparation: ['Воздержание от половой активности 2-3 дня', 'Анализ на ПСА'],
      estimatedCost: '2500-5000₽',
      frequency: 'Ежегодно после 45 лет'
    });
  }

  // Базовые рекомендации для всех
  specialists.push({
    id: 'general-practitioner',
    specialist: 'Терапевт',
    urgency: 'annual',
    reason: 'Общий профилактический осмотр',
    whatToExpected: 'Физикальный осмотр, оценка общего состояния здоровья',
    preparation: ['Результаты анализов крови', 'Список принимаемых препаратов'],
    estimatedCost: '1500-3000₽',
    frequency: 'Ежегодно'
  });

  // Рекомендации по добавкам на основе анализа
  supplements.push({
    id: 'vitamin-d',
    name: 'Витамин D3',
    dosage: '1000-2000 МЕ',
    timing: 'Утром с жирной пищей',
    benefit: 'Поддержка иммунитета и здоровья костей',
    duration: 'Постоянно, особенно зимой',
    cost: '500-1000₽ за упаковку',
    whereToBuy: 'Аптеки, проверенные интернет-магазины'
  });

  if (healthProfile.stressLevel > 6) {
    supplements.push({
      id: 'magnesium',
      name: 'Магний',
      dosage: '300-400 мг',
      timing: 'Вечером с едой',
      benefit: 'Снижение стресса, улучшение сна',
      duration: '2-3 месяца',
      cost: '800-1500₽',
      whereToBuy: 'Аптеки'
    });
  }

  // Базовые анализы
  tests.push({
    id: 'general-blood',
    testName: 'Общий анализ крови',
    priority: 'medium',
    frequency: 'Раз в год',
    reason: 'Базовая оценка состояния здоровья',
    preparation: ['Сдавать натощак', 'Исключить алкоголь за 24 часа'],
    expectedCost: '500-800₽',
    whereToGet: 'Любая лаборатория',
    whatItChecks: ['Гемоглобин', 'Лейкоциты', 'Тромбоциты', 'СОЭ']
  });

  tests.push({
    id: 'biochemistry',
    testName: 'Биохимический анализ крови',
    priority: 'high',
    frequency: 'Раз в год',
    reason: 'Оценка функции органов',
    preparation: ['Строго натощак 12 часов', 'Исключить физические нагрузки'],
    expectedCost: '1500-3000₽',
    whereToGet: 'Лаборатории (Инвитро, Гемотест)',
    whatItChecks: ['Глюкоза', 'Холестерин', 'Печеночные пробы', 'Почечные показатели']
  });

  return {
    recommendations,
    riskFactors,
    supplements,
    specialists,
    tests
  };
};
