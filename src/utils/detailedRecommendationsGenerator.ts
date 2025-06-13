
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
    return { recommendations, riskFactors, supplements, specialists, tests };
  }

  // Рекомендации на основе физической активности
  if (healthProfile.physicalActivity === 'sedentary' || healthProfile.exerciseFrequency < 2) {
    recommendations.push({
      id: 'increase-activity',
      category: 'Физическая активность',
      title: 'Увеличение физической активности',
      priority: 'high',
      description: 'Ваш текущий уровень активности недостаточен для поддержания здоровья',
      specificActions: [
        'Начните с 15-минутных прогулок каждый день',
        'Добавьте упражнения с весом собственного тела 2 раза в неделю',
        'Используйте лестницу вместо лифта',
        'Делайте перерывы на движение каждый час при сидячей работе'
      ],
      expectedResult: 'Улучшение сердечно-сосудистого здоровья, повышение энергии',
      timeframe: '2-4 недели для начальных результатов',
      cost: 'Бесплатно или до 3000₽/месяц на абонемент в спортзал'
    });

    riskFactors.push({
      id: 'sedentary-risk',
      factor: 'Малоподвижный образ жизни',
      level: 'high',
      description: 'Низкая физическая активность увеличивает риск сердечно-сосудистых заболеваний',
      currentImpact: 'Повышенный риск диабета, ожирения, депрессии',
      mitigation: [
        'Постепенное увеличение активности',
        'Регулярные прогулки',
        'Занятия спортом'
      ],
      monitoringFrequency: 'Еженедельный контроль активности'
    });
  }

  // Рекомендации на основе питания
  if (healthProfile.waterIntake < 6) {
    recommendations.push({
      id: 'increase-water',
      category: 'Питание и гидратация',
      title: 'Увеличение потребления воды',
      priority: 'medium',
      description: 'Недостаточное потребление воды может влиять на обмен веществ',
      specificActions: [
        'Пейте стакан воды сразу после пробуждения',
        'Носите с собой бутылку воды',
        'Установите напоминания на телефон',
        'Добавляйте лимон или мяту для вкуса'
      ],
      expectedResult: 'Улучшение пищеварения, повышение энергии, улучшение состояния кожи',
      timeframe: '1-2 недели',
      cost: 'Бесплатно'
    });
  }

  // Рекомендации на основе сна
  if (healthProfile.sleepHours < 7 || healthProfile.sleepQuality === 'poor') {
    recommendations.push({
      id: 'improve-sleep',
      category: 'Сон и восстановление',
      title: 'Оптимизация качества сна',
      priority: 'high',
      description: 'Недостаток качественного сна негативно влияет на все аспекты здоровья',
      specificActions: [
        'Ложитесь спать в одно и то же время каждый день',
        'Создайте прохладную темную обстановку в спальне',
        'Избегайте экранов за час до сна',
        'Практикуйте релаксационные техники'
      ],
      expectedResult: 'Улучшение концентрации, настроения, иммунитета',
      timeframe: '2-3 недели',
      cost: 'До 5000₽ на улучшение спального места'
    });

    supplements.push({
      id: 'melatonin',
      name: 'Мелатонин',
      dosage: '1-3 мг',
      timing: 'За 30-60 минут до сна',
      benefit: 'Улучшение засыпания и качества сна',
      duration: '1-2 месяца',
      cost: '500-1000₽',
      whereToBuy: 'Аптеки, интернет-магазины БАД'
    });
  }

  // Рекомендации на основе стресса
  if (healthProfile.stressLevel > 6 || healthProfile.anxietyLevel > 6) {
    recommendations.push({
      id: 'stress-management',
      category: 'Психическое здоровье',
      title: 'Управление стрессом',
      priority: 'high',
      description: 'Высокий уровень стресса требует активного управления',
      specificActions: [
        'Практикуйте медитацию 10 минут в день',
        'Ведите дневник благодарности',
        'Изучите техники дыхательных упражнений',
        'Рассмотрите возможность психотерапии'
      ],
      expectedResult: 'Снижение уровня кортизола, улучшение настроения',
      timeframe: '4-6 недель',
      cost: 'От бесплатно до 5000₽/сеанс терапии'
    });

    specialists.push({
      id: 'psychologist',
      specialist: 'Психолог/Психотерапевт',
      urgency: 'within_month',
      reason: 'Высокий уровень стресса и тревожности',
      whatToExpected: 'Оценка психического состояния, обучение техникам управления стрессом',
      preparation: ['Подготовьте список основных стрессоров', 'Ведите дневник настроения неделю'],
      estimatedCost: '3000-8000₽ за сеанс',
      frequency: 'Еженедельно в течение 2-3 месяцев'
    });

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

  // Рекомендации на основе курения
  if (healthProfile.smokingStatus === 'regular' || healthProfile.smokingStatus === 'occasional') {
    recommendations.push({
      id: 'quit-smoking',
      category: 'Вредные привычки',
      title: 'Прекращение курения',
      priority: 'high',
      description: 'Курение является основным фактором риска многих заболеваний',
      specificActions: [
        'Выберите дату прекращения курения',
        'Обратитесь к специалисту по никотиновой зависимости',
        'Рассмотрите никотинозаместительную терапию',
        'Найдите альтернативные способы справления со стрессом'
      ],
      expectedResult: 'Снижение риска рака, улучшение функции легких',
      timeframe: '3-6 месяцев для существенных улучшений',
      cost: '5000-15000₽ на программу отказа от курения'
    });

    riskFactors.push({
      id: 'smoking-risk',
      factor: 'Курение',
      level: 'high',
      description: 'Значительно повышает риск онкологических и сердечно-сосудистых заболеваний',
      currentImpact: 'Ухудшение функции легких, повышенный риск инфаркта',
      mitigation: [
        'Постепенное снижение количества сигарет',
        'Никотинозаместительная терапия',
        'Психологическая поддержка'
      ],
      monitoringFrequency: 'Еженедельный контроль прогресса'
    });
  }

  // Базовые анализы для всех
  tests.push({
    id: 'general-blood-test',
    testName: 'Общий анализ крови с лейкоформулой',
    priority: 'medium',
    frequency: 'Раз в год',
    reason: 'Базовая оценка состояния здоровья',
    preparation: ['Сдавать натощак', 'Исключить алкоголь за 24 часа'],
    expectedCost: '500-800₽',
    whereToGet: 'Любая лаборатория (Инвитро, Гемотест, КДЛ)',
    whatItChecks: ['Гемоглобин', 'Лейкоциты', 'Тромбоциты', 'СОЭ']
  });

  tests.push({
    id: 'biochemistry',
    testName: 'Биохимический анализ крови',
    priority: 'medium',
    frequency: 'Раз в год',
    reason: 'Оценка функции органов и метаболизма',
    preparation: ['Сдавать строго натощак (12 часов)', 'Исключить физические нагрузки'],
    expectedCost: '1500-3000₽',
    whereToGet: 'Лаборатории',
    whatItChecks: ['Глюкоза', 'Холестерин', 'Печеночные пробы', 'Креатинин']
  });

  // Дополнительные анализы на основе возраста
  if (healthProfile.age > 40) {
    tests.push({
      id: 'cardiac-markers',
      testName: 'Кардиологические маркеры',
      priority: 'high',
      frequency: 'Раз в год после 40 лет',
      reason: 'Профилактика сердечно-сосудистых заболеваний',
      preparation: ['Натощак', 'Исключить стресс и нагрузки'],
      expectedCost: '2000-4000₽',
      whereToGet: 'Специализированные кардиологические центры',
      whatItChecks: ['Тропонин', 'NT-proBNP', 'СРБ высокочувствительный']
    });

    specialists.push({
      id: 'cardiologist',
      specialist: 'Кардиолог',
      urgency: 'annual',
      reason: 'Профилактический осмотр после 40 лет',
      whatToExpected: 'ЭКГ, измерение давления, оценка рисков',
      preparation: ['Подготовьте список принимаемых препаратов', 'Результаты последних анализов'],
      estimatedCost: '2000-5000₽',
      frequency: 'Ежегодно'
    });
  }

  // Рекомендации по добавкам на основе общих потребностей
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

  supplements.push({
    id: 'omega-3',
    name: 'Омега-3 (EPA/DHA)',
    dosage: '1000-2000 мг',
    timing: 'С едой',
    benefit: 'Поддержка сердечно-сосудистой системы и мозга',
    duration: '3-6 месяцев курсами',
    cost: '1500-3000₽',
    whereToBuy: 'Аптеки, специализированные магазины спортпита'
  });

  return {
    recommendations,
    riskFactors,
    supplements,
    specialists,
    tests
  };
};
