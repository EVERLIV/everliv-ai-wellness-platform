
import { HealthProfileData } from '@/hooks/useHealthProfile';
import { SpecialistRecommendation } from '@/types/detailedRecommendations';

export const generateSpecialistRecommendations = (healthProfile?: HealthProfileData): SpecialistRecommendation[] => {
  const specialists: SpecialistRecommendation[] = [];

  if (!healthProfile) {
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
    return specialists;
  }

  // Специалисты на основе курения
  if (healthProfile.smokingStatus === 'regular' || healthProfile.smokingStatus === 'occasional') {
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

  // Специалисты на основе физической активности
  if (healthProfile.physicalActivity === 'sedentary' || healthProfile.exerciseFrequency < 2) {
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

  // Специалисты на основе употребления алкоголя
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

  // Специалисты на основе стресса и сна
  if (healthProfile.sleepHours < 7 || healthProfile.stressLevel > 6) {
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

  // Специалисты на основе возраста
  if (healthProfile.age > 40) {
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

  return specialists;
};
