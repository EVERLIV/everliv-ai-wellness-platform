
import { HealthProfileData } from '@/types/healthProfile';
import { SpecialistRecommendation } from '@/types/detailedRecommendations';

export const generateSpecialistRecommendations = (healthProfile?: HealthProfileData): SpecialistRecommendation[] => {
  const specialists: SpecialistRecommendation[] = [];

  if (!healthProfile) {
    return [
      {
        id: 'general-practitioner',
        specialist: 'Терапевт',
        urgency: 'annual',
        reason: 'Общий медицинский осмотр и консультация',
        whatToExpected: 'Базовый осмотр, измерение давления, рекомендации по здоровью',
        preparation: [
          'Подготовьте список текущих жалоб',
          'Возьмите результаты предыдущих анализов',
          'Составьте список принимаемых препаратов'
        ],
        estimatedCost: '1500-3000₽',
        frequency: 'Раз в год'
      }
    ];
  }

  // Always recommend general practitioner
  specialists.push({
    id: 'annual-checkup',
    specialist: 'Терапевт',
    urgency: 'annual',
    reason: 'Ежегодный профилактический осмотр',
    whatToExpected: 'Комплексная оценка состояния здоровья, направления на анализы',
    preparation: [
      'Подготовьте медицинскую карту',
      'Список текущих симптомов и жалоб',
      'Информацию о семейной истории болезней'
    ],
    estimatedCost: '2000-4000₽',
    frequency: 'Ежегодно'
  });

  // BMI-based recommendations
  const bmi = healthProfile.weight / ((healthProfile.height / 100) ** 2);
  if (bmi > 30) {
    specialists.push({
      id: 'endocrinologist',
      specialist: 'Эндокринолог',
      urgency: 'within_month',
      reason: 'Консультация по метаболическим нарушениям и ожирению',
      whatToExpected: 'Обследование гормонального статуса, план коррекции веса',
      preparation: [
        'Анализы на гормоны щитовидной железы',
        'Анализ на инсулин и глюкозу',
        'Дневник питания за неделю'
      ],
      estimatedCost: '3000-6000₽',
      frequency: 'Каждые 3-6 месяцев'
    });
  }

  // Mental health recommendations
  if (healthProfile.stressLevel > 7 || healthProfile.anxietyLevel > 7) {
    specialists.push({
      id: 'psychologist',
      specialist: 'Психолог/Психотерапевт',
      urgency: 'within_month',
      reason: 'Работа с высоким уровнем стресса и тревожности',
      whatToExpected: 'Оценка психологического состояния, обучение техникам релаксации',
      preparation: [
        'Подумайте о основных источниках стресса',
        'Опишите симптомы тревожности',
        'Подготовьте вопросы о методах работы'
      ],
      estimatedCost: '3000-8000₽',
      frequency: 'Еженедельно в течение курса'
    });
  }

  // Sleep recommendations
  if (healthProfile.sleepHours < 6 || healthProfile.sleepQuality === 'poor') {
    specialists.push({
      id: 'somnologist',
      specialist: 'Сомнолог',
      urgency: 'within_3_months',
      reason: 'Диагностика и лечение нарушений сна',
      whatToExpected: 'Полисомнография, анализ структуры сна, рекомендации по лечению',
      preparation: [
        'Ведите дневник сна 2 недели',
        'Опишите характер нарушений сна',
        'Исключите прием снотворных за неделю до визита'
      ],
      estimatedCost: '5000-15000₽',
      frequency: 'По необходимости'
    });
  }

  // Chronic conditions
  if (healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0) {
    specialists.push({
      id: 'specialist-chronic',
      specialist: 'Узкие специалисты',
      urgency: 'within_3_months',
      reason: 'Наблюдение по хроническим заболеваниям',
      whatToExpected: 'Контроль течения заболеваний, коррекция терапии',
      preparation: [
        'Результаты последних обследований',
        'Дневник симптомов',
        'Список принимаемых препаратов'
      ],
      estimatedCost: '2500-8000₽',
      frequency: 'Согласно рекомендациям врача'
    });
  }

  return specialists;
};
