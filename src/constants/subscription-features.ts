
export const FEATURES = {
  BLOOD_ANALYSIS: "lab_analyses",
  PHOTO_BLOOD_ANALYSIS: "photo_lab_analyses", 
  CHAT_MESSAGES: "chat_messages",
  NUTRITION_DIARY: "nutrition_diary",
  HEALTH_PROFILE: "health_profile",
  ANALYTICS: "analytics",
  BIOLOGICAL_AGE_TEST: "biological_age_test",
  COMPREHENSIVE_AI_ANALYSIS: "comprehensive_ai_analysis"
} as const;

// Лимиты использования для каждого плана
export const PLAN_FEATURES = {
  basic: {
    lab_analyses: 5, // текстовые анализы
    photo_lab_analyses: 1, // фото анализы  
    chat_messages: 99,
    nutrition_diary: true,
    health_profile: true,
    analytics: false,
    biological_age_test: 1, // 1 тест в месяц
    comprehensive_ai_analysis: 0 // недоступен в базовом плане
  },
  premium: {
    lab_analyses: 15, // общий лимит для текста и фото вместе
    photo_lab_analyses: 15, // тот же лимит, что и для текста
    chat_messages: 199,
    nutrition_diary: true,
    health_profile: true,
    analytics: true,
    biological_age_test: 5, // 5 тестов в месяц
    comprehensive_ai_analysis: 3 // 3 анализа в месяц
  }
} as const;

// Описания функций для UI компонентов
export const FEATURE_DESCRIPTIONS = {
  lab_analyses: {
    name: "Анализ крови",
    description: "AI-интерпретация результатов анализов крови",
    includedIn: {
      basic: true,
      premium: true
    }
  },
  photo_lab_analyses: {
    name: "Анализ фото результатов",
    description: "Загрузка и анализ фотографий медицинских анализов",
    includedIn: {
      basic: true,
      premium: true
    }
  },
  chat_messages: {
    name: "Сообщения с AI-доктором",
    description: "Консультации с персональным AI-доктором",
    includedIn: {
      basic: true,
      premium: true
    }
  },
  nutrition_diary: {
    name: "Дневник питания",
    description: "Отслеживание питания и калорий",
    includedIn: {
      basic: true,
      premium: true
    }
  },
  health_profile: {
    name: "Профиль здоровья",
    description: "Персональный профиль с медицинской историей",
    includedIn: {
      basic: true,
      premium: true
    }
  },
  analytics: {
    name: "Аналитика здоровья",
    description: "Детальная аналитика и тренды здоровья",
    includedIn: {
      basic: false,
      premium: true
    }
  },
  biological_age_test: {
    name: "Тест на биологический возраст",
    description: "Определение биологического возраста на основе данных о здоровье",
    includedIn: {
      basic: true,
      premium: true
    }
  },
  comprehensive_ai_analysis: {
    name: "Комплексный AI анализ",
    description: "Полная оценка здоровья с персонализированными рекомендациями",
    includedIn: {
      basic: false,
      premium: true
    }
  }
} as const;

// Информация о планах подписки
export const SUBSCRIPTION_PLANS = {
  basic: {
    name: "Базовый",
    price: 0,
    description: "Базовые функции для начала работы с AI-доктором",
    features: [
      "5 текстовых анализов крови в месяц",
      "1 анализ фото в месяц", 
      "99 сообщений с AI-доктором",
      "Ведение дневника питания",
      "Базовый профиль здоровья",
      "1 тест биологического возраста в месяц"
    ]
  },
  premium: {
    name: "Премиум",
    price: 999,
    description: "Полный доступ ко всем возможностям платформы",
    features: [
      "15 анализов в месяц (текст + фото)",
      "199 сообщений с персональным AI-доктором",
      "Полный профиль здоровья с историей",
      "Расширенная аналитика и тренды",
      "5 тестов биологического возраста в месяц",
      "3 комплексных AI анализа в месяц",
      "Персональные протоколы оздоровления",
      "Приоритетная поддержка"
    ]
  }
} as const;

export type FeatureName = typeof FEATURES[keyof typeof FEATURES];
export type PlanType = keyof typeof PLAN_FEATURES;
