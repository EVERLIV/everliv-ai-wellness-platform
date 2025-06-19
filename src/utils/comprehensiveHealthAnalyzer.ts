
import { HealthProfileData } from '@/types/healthProfile';
import { CachedAnalytics } from '@/types/analytics';

interface ComprehensiveRecommendation {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  expectedResult: string;
  timeframe: string;
  actions: string[];
}

interface ComprehensiveAnalysis {
  priority: ComprehensiveRecommendation[];
  lifestyle: ComprehensiveRecommendation[];
  nutrition: ComprehensiveRecommendation[];
  fitness: ComprehensiveRecommendation[];
}

export const generateComprehensiveHealthRecommendations = (
  healthProfile?: HealthProfileData,
  analytics?: CachedAnalytics
): ComprehensiveAnalysis => {
  const recommendations: ComprehensiveAnalysis = {
    priority: [],
    lifestyle: [],
    nutrition: [],
    fitness: []
  };

  if (!healthProfile) {
    return recommendations;
  }

  // Анализ критических показателей
  if (healthProfile.labResults) {
    const { labResults } = healthProfile;
    
    // Критические лабораторные показатели
    if (labResults.cholesterol && labResults.cholesterol > 6.2) {
      recommendations.priority.push({
        title: 'Критически высокий холестерин',
        description: 'Уровень холестерина превышает 6.2 ммоль/л, что создает высокий риск сердечно-сосудистых заболеваний',
        category: 'Лабораторные показатели',
        priority: 'high',
        expectedResult: 'Снижение риска инфаркта и инсульта на 40%',
        timeframe: '3-6 месяцев',
        actions: [
          'Немедленно обратиться к кардиологу',
          'Исключить трансжиры и насыщенные жиры',
          'Увеличить потребление омега-3',
          'Начать регулярные кардиотренировки'
        ]
      });
    }

    if (labResults.bloodSugar && labResults.bloodSugar > 7.0) {
      recommendations.priority.push({
        title: 'Высокий уровень глюкозы',
        description: 'Глюкоза крови превышает 7.0 ммоль/л, необходимо исключить преддиабет',
        category: 'Эндокринология',
        priority: 'high',
        expectedResult: 'Нормализация углеводного обмена',
        timeframe: '2-4 месяца',
        actions: [
          'Консультация эндокринолога',
          'Анализ на гликированный гемоглобин',
          'Низкоуглеводная диета',
          'Контроль порций и времени приема пищи'
        ]
      });
    }
  }

  // Анализ образа жизни
  if (healthProfile.stressLevel > 7) {
    recommendations.priority.push({
      title: 'Критический уровень стресса',
      description: 'Хронический стресс разрушает иммунную систему и ускоряет старение',
      category: 'Психическое здоровье',
      priority: 'high',
      expectedResult: 'Улучшение качества жизни и здоровья',
      timeframe: '1-2 месяца',
      actions: [
        'Освоить техники медитации',
        'Регулярные прогулки на природе',
        'Нормализация режима сна',
        'Рассмотреть работу с психологом'
      ]
    });
  }

  // Рекомендации по образу жизни
  if (healthProfile.sleepHours < 7) {
    recommendations.lifestyle.push({
      title: 'Оптимизация сна',
      description: 'Недостаток сна нарушает выработку гормонов и снижает иммунитет',
      category: 'Сон',
      priority: 'high',
      expectedResult: 'Улучшение энергии и концентрации на 30%',
      timeframe: '2-3 недели',
      actions: [
        'Ложиться спать в одно время',
        'Создать темную прохладную комнату',
        'Избегать экранов за 2 часа до сна',
        'Магний и мелатонин по показаниям'
      ]
    });
  }

  if (healthProfile.exerciseFrequency < 3) {
    recommendations.fitness.push({
      title: 'Увеличение физической активности',
      description: 'Регулярные тренировки - основа долголетия и здоровья',
      category: 'Фитнес',
      priority: 'medium',
      expectedResult: 'Улучшение всех показателей здоровья',
      timeframe: '1-2 месяца',
      actions: [
        'Начать с 20-минутных прогулок',
        'Добавить силовые упражнения 2 раза в неделю',
        'Включить растяжку и мобильность',
        'Постепенно увеличивать нагрузку'
      ]
    });
  }

  // Рекомендации по питанию
  if (healthProfile.waterIntake < 8) {
    recommendations.nutrition.push({
      title: 'Оптимизация гидратации',
      description: 'Адекватное потребление воды критично для всех функций организма',
      category: 'Питание',
      priority: 'medium',
      expectedResult: 'Улучшение энергии и концентрации',
      timeframe: '1 неделя',
      actions: [
        'Начинать день со стакана воды',
        'Пить воду перед каждым приемом пищи',
        'Использовать напоминания в телефоне',
        'Добавить электролиты при интенсивных тренировках'
      ]
    });
  }

  // Анализ возрастных рисков
  if (healthProfile.age > 40) {
    recommendations.lifestyle.push({
      title: 'Возрастная профилактика',
      description: 'После 40 лет критично важна профилактика возрастных заболеваний',
      category: 'Профилактика',
      priority: 'medium',
      expectedResult: 'Замедление процессов старения',
      timeframe: 'Постоянно',
      actions: [
        'Регулярные комплексные обследования',
        'Контроль гормонального статуса',
        'Антиоксидантная терапия',
        'Когнитивные тренировки'
      ]
    });
  }

  return recommendations;
};
