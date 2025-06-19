
import { HealthProfileData } from '@/types/healthProfile';
import { CachedAnalytics } from '@/types/analytics';

interface ModernRecommendation {
  id: string;
  category: 'intermittent_fasting' | 'cold_therapy' | 'breathing_practices';
  title: string;
  description: string;
  benefits: string[];
  instructions: string[];
  frequency: string;
  duration: string;
  contraindications: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scientificBasis: string;
}

export const generateModernRecommendations = (
  healthProfile?: HealthProfileData,
  analytics?: CachedAnalytics
): ModernRecommendation[] => {
  const recommendations: ModernRecommendation[] = [];
  const settings = healthProfile?.recommendationSettings;

  // Интервальное голодание
  if (settings?.intermittentFasting !== false) {
    const ifRecommendation = generateIntermittentFastingRecommendation(healthProfile, analytics);
    if (ifRecommendation) recommendations.push(ifRecommendation);
  }

  // Практики с холодом
  if (settings?.coldTherapy !== false) {
    const coldRecommendation = generateColdTherapyRecommendation(healthProfile, analytics);
    if (coldRecommendation) recommendations.push(coldRecommendation);
  }

  // Дыхательные практики
  if (settings?.breathingPractices !== false) {
    const breathingRecommendation = generateBreathingPracticesRecommendation(healthProfile, analytics);
    if (breathingRecommendation) recommendations.push(breathingRecommendation);
  }

  return recommendations;
};

const generateIntermittentFastingRecommendation = (
  healthProfile?: HealthProfileData,
  analytics?: CachedAnalytics
): ModernRecommendation | null => {
  const age = healthProfile?.age || 30;
  const weight = healthProfile?.weight || 70;
  const stressLevel = healthProfile?.stressLevel || 5;

  // Определяем подходящий тип интервального голодания
  let protocol = '16:8';
  let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

  if (age > 50 || weight < 60) {
    protocol = '14:10';
  } else if (stressLevel < 4 && age < 40) {
    protocol = '18:6';
    difficulty = 'intermediate';
  }

  return {
    id: 'intermittent_fasting',
    category: 'intermittent_fasting',
    title: `Интервальное голодание ${protocol}`,
    description: `Персонализированная программа интервального голодания с окном питания ${protocol.split(':')[1]} часов`,
    benefits: [
      'Улучшение метаболизма и снижение веса',
      'Повышение чувствительности к инсулину',
      'Улучшение когнитивных функций',
      'Снижение воспаления в организме',
      'Активация процессов аутофагии'
    ],
    instructions: [
      `Ешьте только в течение ${protocol.split(':')[1]} часов в день`,
      'Начните с легкого завтрака в 12:00',
      'Последний прием пищи до 20:00',
      'Пейте воду, чай и кофе без сахара в период голодания',
      'Постепенно увеличивайте период голодания'
    ],
    frequency: 'Ежедневно',
    duration: '4-8 недель для адаптации',
    contraindications: [
      'Беременность и грудное вскармливание',
      'Диабет 1 типа',
      'Расстройства пищевого поведения',
      'Прием некоторых лекарств'
    ],
    difficulty,
    scientificBasis: 'Исследования показывают улучшение маркеров здоровья при правильном применении интервального голодания'
  };
};

const generateColdTherapyRecommendation = (
  healthProfile?: HealthProfileData,
  analytics?: CachedAnalytics
): ModernRecommendation | null => {
  const stressLevel = healthProfile?.stressLevel || 5;
  const age = healthProfile?.age || 30;

  let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  let temperature = '15-20°C';
  let duration = '30 секунд';

  if (stressLevel < 4 && age < 45) {
    difficulty = 'intermediate';
    temperature = '12-15°C';
    duration = '1-2 минуты';
  }

  return {
    id: 'cold_therapy',
    category: 'cold_therapy',
    title: 'Терапия холодом',
    description: 'Персонализированная программа закаливания и криотерапии для улучшения здоровья',
    benefits: [
      'Укрепление иммунной системы',
      'Улучшение циркуляции крови',
      'Повышение уровня энергии',
      'Снижение воспаления',
      'Улучшение качества сна',
      'Повышение стрессоустойчивости'
    ],
    instructions: [
      `Начните с холодного душа температурой ${temperature}`,
      `Продолжительность: ${duration}`,
      'Дышите глубоко и спокойно',
      'Постепенно увеличивайте время воздействия',
      'Заканчивайте контрастным душем'
    ],
    frequency: '3-4 раза в неделю',
    duration: '2-4 недели для адаптации',
    contraindications: [
      'Сердечно-сосудистые заболевания',
      'Гипертония',
      'Простудные заболевания',
      'Беременность'
    ],
    difficulty,
    scientificBasis: 'Исследования подтверждают положительное влияние контролируемого воздействия холода на иммунитет и метаболизм'
  };
};

const generateBreathingPracticesRecommendation = (
  healthProfile?: HealthProfileData,
  analytics?: CachedAnalytics
): ModernRecommendation | null => {
  const stressLevel = healthProfile?.stressLevel || 5;
  const anxietyLevel = healthProfile?.anxietyLevel || 5;

  let technique = 'дыхание 4-7-8';
  let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

  if (stressLevel > 6 || anxietyLevel > 6) {
    technique = 'коробочное дыхание 4-4-4-4';
  } else if (stressLevel < 4 && anxietyLevel < 4) {
    technique = 'дыхание Вим Хофа';
    difficulty = 'intermediate';
  }

  return {
    id: 'breathing_practices',
    category: 'breathing_practices',
    title: `Дыхательные практики: ${technique}`,
    description: 'Персонализированные дыхательные упражнения для снижения стресса и улучшения самочувствия',
    benefits: [
      'Снижение уровня стресса и тревожности',
      'Улучшение качества сна',
      'Повышение концентрации внимания',
      'Нормализация давления',
      'Улучшение работы нервной системы',
      'Повышение уровня энергии'
    ],
    instructions: technique === 'дыхание 4-7-8' 
      ? [
          'Вдох через нос на 4 счета',
          'Задержка дыхания на 7 счетов',
          'Выдох через рот на 8 счетов',
          'Повторите цикл 4-8 раз',
          'Практикуйте в спокойной обстановке'
        ]
      : technique === 'коробочное дыхание 4-4-4-4'
      ? [
          'Вдох на 4 счета',
          'Задержка на 4 счета',
          'Выдох на 4 счета',
          'Пауза на 4 счета',
          'Повторите 10-15 циклов'
        ]
      : [
          '30 глубоких вдохов и выдохов',
          'Задержка дыхания после выдоха',
          'Глубокий вдох и задержка на 15 секунд',
          'Повторите 3-4 раунда',
          'ОСТОРОЖНО: только для здоровых людей'
        ],
    frequency: 'Ежедневно, 1-2 раза',
    duration: '5-15 минут за сессию',
    contraindications: [
      'Серьезные заболевания легких',
      'Сердечно-сосудистые заболевания',
      'Беременность (для интенсивных техник)',
      'Панические атаки в анамнезе'
    ],
    difficulty,
    scientificBasis: 'Научно доказано влияние контролируемого дыхания на парасимпатическую нервную систему'
  };
};
