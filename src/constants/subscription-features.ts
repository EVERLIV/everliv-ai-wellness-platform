
export const FEATURES = {
  BLOOD_ANALYSIS: "lab_analyses",
  PHOTO_BLOOD_ANALYSIS: "photo_lab_analyses", 
  CHAT_MESSAGES: "chat_messages",
  NUTRITION_DIARY: "nutrition_diary",
  HEALTH_PROFILE: "health_profile",
  ANALYTICS: "analytics"
} as const;

export const PLAN_FEATURES = {
  basic: {
    lab_analyses: 5, // текстовые анализы
    photo_lab_analyses: 1, // фото анализы  
    chat_messages: 99,
    nutrition_diary: true,
    health_profile: true,
    analytics: false
  },
  premium: {
    lab_analyses: 15, // общий лимит для текста и фото вместе
    photo_lab_analyses: 15, // тот же лимит, что и для текста
    chat_messages: 199,
    nutrition_diary: true,
    health_profile: true,
    analytics: true
  }
} as const;

export type FeatureName = typeof FEATURES[keyof typeof FEATURES];
export type PlanType = keyof typeof PLAN_FEATURES;
