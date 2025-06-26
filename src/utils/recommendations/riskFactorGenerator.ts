
import { HealthProfileData } from '@/types/healthProfile';
import { RiskFactor } from '@/types/detailedRecommendations';

export const generateRiskFactors = (healthProfile?: HealthProfileData): RiskFactor[] => {
  const riskFactors: RiskFactor[] = [];

  if (!healthProfile) {
    return [
      {
        id: 'no-profile',
        factor: 'Отсутствие данных профиля',
        level: 'medium',
        description: 'Без данных о здоровье сложно оценить факторы риска',
        currentImpact: 'Невозможность персональной оценки рисков',
        mitigation: ['Заполните профиль здоровья для анализа факторов риска'],
        monitoringFrequency: 'Однократно'
      }
    ];
  }

  // Calculate BMI and check for risk factors
  const bmi = healthProfile.weight / ((healthProfile.height / 100) ** 2);
  
  if (bmi > 30) {
    riskFactors.push({
      id: 'obesity',
      factor: 'Ожирение',
      level: 'high',
      description: 'ИМТ превышает 30, что значительно повышает риски для здоровья',
      currentImpact: 'Повышенный риск диабета, сердечно-сосудистых заболеваний',
      mitigation: [
        'Консультация с эндокринологом',
        'Разработка плана питания',
        'Постепенное увеличение физической активности'
      ],
      monitoringFrequency: 'Ежемесячно'
    });
  } else if (bmi > 25) {
    riskFactors.push({
      id: 'overweight',
      factor: 'Избыточный вес',
      level: 'medium',
      description: 'ИМТ между 25-30, требует внимания к весу',
      currentImpact: 'Умеренно повышенный риск метаболических нарушений',
      mitigation: [
        'Коррекция питания',
        'Увеличение физической активности',
        'Контроль порций'
      ],
      monitoringFrequency: 'Ежемесячно'
    });
  }

  if (healthProfile.smokingStatus === 'current_light' || 
      healthProfile.smokingStatus === 'current_moderate' || 
      healthProfile.smokingStatus === 'current_heavy') {
    riskFactors.push({
      id: 'smoking',
      factor: 'Курение',
      level: 'high',
      description: 'Регулярное курение значительно повышает риски для здоровья',
      currentImpact: 'Высокий риск рака легких, сердечно-сосудистых заболеваний',
      mitigation: [
        'Обращение к специалисту по отказу от курения',
        'Использование никотинозаместительной терапии',
        'Поддержка близких и групп взаимопомощи'
      ],
      monitoringFrequency: 'Еженедельно'
    });
  }

  if (healthProfile.alcoholConsumption === 'regularly') {
    riskFactors.push({
      id: 'alcohol',
      factor: 'Регулярное употребление алкоголя',
      level: 'high',
      description: 'Регулярное потребление алкоголя может привести к зависимости',
      currentImpact: 'Риск поражения печени, зависимости, других органов',
      mitigation: [
        'Консультация с наркологом',
        'Постепенное снижение дозы',
        'Поиск альтернативных способов релаксации'
      ],
      monitoringFrequency: 'Еженедельно'
    });
  }

  if (healthProfile.stressLevel > 7) {
    riskFactors.push({
      id: 'high-stress',
      factor: 'Высокий уровень стресса',
      level: 'medium',
      description: 'Хронический стресс негативно влияет на все системы организма',
      currentImpact: 'Повышенный риск сердечно-сосудистых заболеваний, депрессии',
      mitigation: [
        'Техники управления стрессом',
        'Медитация и дыхательные практики',
        'Консультация с психологом'
      ],
      monitoringFrequency: 'Еженедельно'
    });
  }

  if (healthProfile.sleepHours < 6) {
    riskFactors.push({
      id: 'sleep-deprivation',
      factor: 'Хроническое недосыпание',
      level: 'medium',
      description: 'Недостаток сна влияет на иммунитет и восстановление',
      currentImpact: 'Снижение иммунитета, концентрации, повышение стресса',
      mitigation: [
        'Улучшение гигиены сна',
        'Создание комфортной среды для сна',
        'Консультация с сомнологом при необходимости'
      ],
      monitoringFrequency: 'Ежедневно'
    });
  }

  return riskFactors.length > 0 ? riskFactors : [
    {
      id: 'low-risk',
      factor: 'Низкий общий риск',
      level: 'low',
      description: 'Значительных факторов риска не выявлено',
      currentImpact: 'Минимальное влияние на здоровье',
      mitigation: ['Поддержание текущего образа жизни'],
      monitoringFrequency: 'Ежемесячно'
    }
  ];
};
