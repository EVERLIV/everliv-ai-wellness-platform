
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
          'Укажите данные о образе жизни',
          'Добавьте результаты лабораторных анализов'
        ],
        expectedResult: 'Получение персональных рекомендаций по здоровью',
        timeframe: '15 минут',
        cost: 'Бесплатно'
      }
    ];
  }

  // Анализ лабораторных данных
  if (healthProfile.labResults) {
    const { labResults } = healthProfile;
    
    // Проверка гемоглобина
    if (labResults.hemoglobin) {
      const isLow = (healthProfile.gender === 'male' && labResults.hemoglobin < 130) ||
                   (healthProfile.gender === 'female' && labResults.hemoglobin < 120);
      
      if (isLow) {
        recommendations.push({
          id: 'low-hemoglobin',
          category: 'Лабораторные показатели',
          title: 'Низкий уровень гемоглобина',
          priority: 'high',
          description: 'Ваш уровень гемоглобина ниже нормы, что может указывать на анемию',
          specificActions: [
            'Увеличьте потребление железосодержащих продуктов',
            'Добавьте витамин C для лучшего усвоения железа',
            'Обратитесь к врачу для дополнительного обследования',
            'Рассмотрите прием препаратов железа по назначению врача'
          ],
          expectedResult: 'Повышение уровня гемоглобина до нормальных значений',
          timeframe: '2-3 месяца',
          cost: 'Средняя'
        });
      }
    }

    // Проверка холестерина
    if (labResults.cholesterol && labResults.cholesterol > 5.2) {
      recommendations.push({
        id: 'high-cholesterol',
        category: 'Лабораторные показатели',
        title: 'Повышенный холестерин',
        priority: 'high',
        description: 'Уровень холестерина превышает норму, что увеличивает риск сердечно-сосудистых заболеваний',
        specificActions: [
          'Снизьте потребление насыщенных жиров',
          'Увеличьте физическую активность',
          'Добавьте омега-3 жирные кислоты в рацион',
          'Регулярно контролируйте уровень холестерина'
        ],
        expectedResult: 'Снижение холестерина до нормальных значений',
        timeframe: '3-6 месяцев',
        cost: 'Минимальная'
      });
    }

    // Проверка глюкозы
    if (labResults.bloodSugar) {
      if (labResults.bloodSugar > 6.1) {
        recommendations.push({
          id: 'high-blood-sugar',
          category: 'Лабораторные показатели',
          title: 'Повышенная глюкоза крови',
          priority: 'high',
          description: 'Уровень глюкозы превышает норму, требуется контроль углеводного обмена',
          specificActions: [
            'Ограничьте потребление простых углеводов',
            'Увеличьте потребление клетчатки',
            'Регулярно измеряйте уровень глюкозы',
            'Обратитесь к эндокринологу'
          ],
          expectedResult: 'Нормализация уровня глюкозы крови',
          timeframe: '1-3 месяца',
          cost: 'Средняя'
        });
      }
    }

    // Проверка тромбоцитов
    if (labResults.platelets) {
      if (labResults.platelets < 150) {
        recommendations.push({
          id: 'low-platelets',
          category: 'Лабораторные показатели',
          title: 'Пониженные тромбоциты',
          priority: 'medium',
          description: 'Низкий уровень тромбоцитов может влиять на свертываемость крови',
          specificActions: [
            'Избегайте травматических видов спорта',
            'Увеличьте потребление продуктов, богатых витамином B12',
            'Обратитесь к гематологу для обследования',
            'Регулярно контролируйте показатели крови'
          ],
          expectedResult: 'Повышение уровня тромбоцитов',
          timeframe: '1-2 месяца',
          cost: 'Средняя'
        });
      }
    }
  }

  // Базовые рекомендации на основе образа жизни
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
        'Следите за питанием',
        'Обновляйте лабораторные анализы раз в год'
      ],
      expectedResult: 'Поддержание хорошего состояния здоровья',
      timeframe: 'Постоянно',
      cost: 'Минимальная'
    }
  ];
};
