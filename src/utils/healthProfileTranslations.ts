
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
  },

  // Цели здоровья
  healthGoals: {
    'cognitive': 'Улучшение когнитивных функций',
    'cardiovascular': 'Здоровье сердечно-сосудистой системы',
    'weight_loss': 'Снижение веса',
    'muscle_gain': 'Набор мышечной массы',
    'energy_boost': 'Повышение энергии',
    'sleep_improvement': 'Улучшение сна',
    'stress_reduction': 'Снижение стресса',
    'immunity_boost': 'Укрепление иммунитета',
    'longevity': 'Увеличение продолжительности жизни',
    'hormonal_balance': 'Гормональный баланс',
    'digestive_health': 'Здоровье пищеварения',
    'skin_health': 'Здоровье кожи',
    'biological_age': 'Улучшение биологического возраста',
    'metabolic_health': 'Метаболическое здоровье',
    'bone_health': 'Здоровье костей',
    'mental_health': 'Психическое здоровье',
    'detox': 'Детоксикация организма',
    'athletic_performance': 'Спортивные результаты',
    'musculoskeletal': 'Здоровье опорно-двигательного аппарата',
    'metabolism': 'Улучшение метаболизма'
  },

  // Лекарства и добавки
  medications: {
    'aspirin': 'Аспирин (кардиомагнил)',
    'metformin': 'Метформин',
    'statins': 'Статины (аторвастатин, розувастатин)',
    'ace_inhibitors': 'Ингибиторы АПФ (лизиноприл, эналаприл)',
    'beta_blockers': 'Бета-блокаторы (бисопролол, метопролол)',
    'calcium_blockers': 'Блокаторы кальциевых каналов (амлодипин)',
    'diuretics': 'Диуретики (индапамид, гидрохлортиазид)',
    'ppi': 'Ингибиторы протонной помпы (омепразол, пантопразол)',
    'thyroid_hormones': 'Гормоны щитовидной железы (L-тироксин)',
    'insulin': 'Инсулин',
    'warfarin': 'Варфарин',
    'direct_anticoagulants': 'Прямые антикоагулянты (ривароксабан, апиксабан)',
    'antidepressants': 'Антидепрессанты',
    'nsaids': 'НПВС (ибупрофен, диклофенак)',
    'contraceptives': 'Оральные контрацептивы',
    'vitamin_d': 'Витамин D',
    'b12': 'Витамин B12',
    'omega3': 'Омега-3',
    'magnesium': 'Магний',
    'probiotics': 'Пробиотики'
  }
};

export const translateValue = (category: keyof typeof translateHealthProfileData, value: string): string => {
  const translations = translateHealthProfileData[category];
  if (translations && value in translations) {
    return translations[value as keyof typeof translations];
  }
  return value;
};

// Специальные функции для перевода массивов
export const translateHealthGoals = (goals: string[]): string[] => {
  return goals.map(goal => translateValue('healthGoals', goal));
};

export const translateMedications = (medications: string[]): string[] => {
  return medications.map(medication => translateValue('medications', medication));
};
