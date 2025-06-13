
import { HealthProfileData } from '@/hooks/useHealthProfile';
import { RiskFactor } from '@/types/detailedRecommendations';

export const generateRiskFactors = (healthProfile?: HealthProfileData): RiskFactor[] => {
  const riskFactors: RiskFactor[] = [];

  if (!healthProfile) {
    riskFactors.push({
      id: 'no-profile',
      factor: 'Отсутствие профиля здоровья',
      level: 'medium',
      description: 'Для точной оценки рисков необходимо заполнить профиль здоровья',
      currentImpact: 'Невозможность персонализированной оценки',
      mitigation: ['Заполните профиль здоровья', 'Загрузите результаты анализов'],
      monitoringFrequency: 'Единоразово'
    });
    return riskFactors;
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
  }

  return riskFactors;
};
