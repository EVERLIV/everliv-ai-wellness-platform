
import { HealthProfileData } from '@/types/healthProfile';
import { DetailedRecommendation } from '@/types/detailedRecommendations';

export const generatePersonalizedRecommendations = (healthProfile?: HealthProfileData): DetailedRecommendation[] => {
  const recommendations: DetailedRecommendation[] = [];

  if (!healthProfile) {
    return [
      {
        id: 'profile-required',
        category: 'Общие',
        title: 'Заполните профиль здоровья',
        priority: 'high',
        description: 'Для получения персональных рекомендаций необходимо заполнить профиль здоровья',
        specificActions: [
          'Перейдите в раздел "Профиль здоровья"',
          'Заполните основную информацию',
          'Укажите данные о образе жизни'
        ],
        expectedResult: 'Получение персональных рекомендаций по здоровью',
        timeframe: '15 минут',
        cost: 'Бесплатно'
      }
    ];
  }

  // Add recommendations based on health profile data
  if (healthProfile.stressLevel > 6) {
    recommendations.push({
      id: 'stress-management',
      category: 'Психическое здоровье',
      title: 'Управление стрессом',
      priority: 'high',
      description: 'Высокий уровень стресса требует активных мер по его снижению',
      specificActions: [
        'Практикуйте медитацию 10-15 минут ежедневно',
        'Введите техники глубокого дыхания',
        'Регулярные прогулки на свежем воздухе'
      ],
      expectedResult: 'Снижение уровня стресса на 2-3 пункта',
      timeframe: '2-4 недели',
      cost: 'Бесплатно'
    });
  }

  if (healthProfile.sleepHours < 7) {
    recommendations.push({
      id: 'sleep-improvement',
      category: 'Сон',
      title: 'Улучшение качества сна',
      priority: 'high',
      description: 'Недостаток сна негативно влияет на здоровье',
      specificActions: [
        'Увеличьте продолжительность сна до 7-9 часов',
        'Создайте режим отхода ко сну',
        'Избегайте экранов за час до сна'
      ],
      expectedResult: 'Улучшение качества сна и общего самочувствия',
      timeframe: '1-2 недели',
      cost: 'Бесплатно'
    });
  }

  if (healthProfile.waterIntake < 6) {
    recommendations.push({
      id: 'hydration',
      category: 'Питание',
      title: 'Увеличение потребления воды',
      priority: 'medium',
      description: 'Недостаточное потребление воды может влиять на здоровье',
      specificActions: [
        'Увеличьте потребление воды до 8 стаканов в день',
        'Носите бутылку воды с собой',
        'Установите напоминания о питье'
      ],
      expectedResult: 'Улучшение гидратации и общего самочувствия',
      timeframe: '1 неделя',
      cost: 'Минимальная'
    });
  }

  return recommendations.length > 0 ? recommendations : [
    {
      id: 'maintain-health',
      category: 'Общие',
      title: 'Поддержание здорового образа жизни',
      priority: 'low',
      description: 'Продолжайте поддерживать текущий уровень здоровья',
      specificActions: [
        'Регулярно контролируйте показатели здоровья',
        'Поддерживайте физическую активность',
        'Следите за питанием'
      ],
      expectedResult: 'Поддержание хорошего состояния здоровья',
      timeframe: 'Постоянно',
      cost: 'Минимальная'
    }
  ];
};
