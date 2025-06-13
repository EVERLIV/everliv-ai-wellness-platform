
export const translateHealthProfileData = {
  // Пол
  gender: {
    'male': 'Мужской',
    'female': 'Женский'
  },

  // Физическая активность
  physicalActivity: {
    'sedentary': 'Сидячий образ жизни',
    'light': 'Легкая активность',
    'moderate': 'Умеренная активность',
    'active': 'Активный',
    'very_active': 'Очень активный'
  },

  // Уровень физической подготовки
  fitnessLevel: {
    'beginner': 'Начинающий',
    'intermediate': 'Средний',
    'advanced': 'Продвинутый',
    'athlete': 'Спортсмен',
    'poor': 'Плохая',
    'fair': 'Удовлетворительная',
    'good': 'Хорошая',
    'excellent': 'Отличная'
  },

  // Курение
  smokingStatus: {
    'never': 'Никогда не курил(а)',
    'former': 'Бросил(а) курить',
    'occasional': 'Курю изредка',
    'regular': 'Курю регулярно'
  },

  // Алкоголь
  alcoholConsumption: {
    'never': 'Не употребляю',
    'rarely': 'Редко (несколько раз в год)',
    'occasionally': 'Иногда (несколько раз в месяц)',
    'weekly': 'Еженедельно',
    'daily': 'Ежедневно'
  },

  // Тип питания
  dietType: {
    'omnivore': 'Всеядное',
    'vegetarian': 'Вегетарианское',
    'vegan': 'Веганское',
    'keto': 'Кетогенное',
    'paleo': 'Палео',
    'mediterranean': 'Средиземноморское'
  },

  // Изменения настроения
  moodChanges: {
    'stable': 'Стабильное настроение',
    'minor_fluctuations': 'Незначительные колебания',
    'moderate_fluctuations': 'Умеренные колебания',
    'significant_fluctuations': 'Значительные колебания',
    'severe_fluctuations': 'Серьезные нарушения настроения'
  },

  // Поддержка психического здоровья
  mentalHealthSupport: {
    'none': 'Не получаю поддержку',
    'family_friends': 'Поддержка семьи и друзей',
    'therapy': 'Психотерапия',
    'medication': 'Медикаментозное лечение',
    'both': 'Терапия и медикаменты',
    'support_groups': 'Группы поддержки'
  },

  // Качество сна
  sleepQuality: {
    'poor': 'Плохое',
    'fair': 'Удовлетворительное',
    'good': 'Хорошее',
    'excellent': 'Отличное'
  }
};

export const translateValue = (category: keyof typeof translateHealthProfileData, value: string): string => {
  const translations = translateHealthProfileData[category];
  if (translations && value in translations) {
    return translations[value as keyof typeof translations];
  }
  return value;
};
