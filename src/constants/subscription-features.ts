
export const PLAN_FEATURES = {
  labAnalyses: {
    name: "Лабораторные анализы",
    description: "Анализ и интерпретация результатов лабораторных исследований",
    includedIn: {
      basic: true,
      standard: true,
      premium: true
    }
  },
  chatAccess: {
    name: "Доступ к AI-доктору",
    description: "Консультации с ИИ-доктором в чате",
    includedIn: {
      basic: true,
      standard: true,
      premium: true
    }
  },
  nutritionDiary: {
    name: "Дневник питания",
    description: "Отслеживание питания и калорий",
    includedIn: {
      basic: true,
      standard: true,
      premium: true
    }
  },
  healthProfile: {
    name: "Профиль здоровья",
    description: "Персональный профиль с историей здоровья",
    includedIn: {
      basic: false,
      standard: true,
      premium: true
    }
  },
  advancedAnalysis: {
    name: "Расширенная аналитика",
    description: "Подробный анализ трендов здоровья",
    includedIn: {
      basic: false,
      standard: false,
      premium: true
    }
  }
};

export const PLAN_LIMITS = {
  basic: {
    labAnalysesPerMonth: 1,
    chatMessagesPerMonth: 99,
    nutritionDiary: true
  },
  premium: {
    labAnalysesPerMonth: 15,
    chatMessagesPerMonth: 199,
    nutritionDiary: true,
    healthProfile: true
  }
};

export const SUBSCRIPTION_PLANS = {
  basic: {
    name: "Базовый",
    type: "basic",
    price: 0,
    description: "Бесплатный тариф с базовыми возможностями",
    features: [
      "1 лабораторный анализ в месяц",
      "99 сообщений в базовом чате",
      "Дневник питания"
    ]
  },
  premium: {
    name: "Премиум", 
    type: "premium",
    price: 999,
    description: "Расширенные возможности для полноценной заботы о здоровье",
    features: [
      "15 лабораторных анализов в месяц",
      "199 сообщений в премиум чате",
      "Профиль здоровья",
      "Дневник питания"
    ]
  }
};

// Add the missing FEATURES constant that other components expect
export const FEATURES = {
  BLOOD_ANALYSIS: "blood_analysis",
  PHOTO_BLOOD_ANALYSIS: "photo_blood_analysis",
  BIOLOGICAL_AGE_TEST: "biological_age_test",
  HEALTH_PROFILE: "health_profile",
  ADVANCED_ANALYTICS: "advanced_analytics",
  CHAT_ACCESS: "chat_access",
  NUTRITION_DIARY: "nutrition_diary"
};
