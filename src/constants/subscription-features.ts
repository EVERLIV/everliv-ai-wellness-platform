
import { PlanFeature } from "@/types/subscription";

export const FEATURES = {
  AI_HEALTH_ANALYSIS: "ai_health_analysis",
  BLOOD_ANALYSIS: "blood_analysis",
  PERSONALIZED_RECOMMENDATIONS: "personalized_recommendations",
  SUPPLEMENTS_SELECTION: "supplements_selection",
  HEALTH_MONITORING: "health_monitoring",
  COMPREHENSIVE_ASSESSMENT: "comprehensive_assessment",
  BIOLOGICAL_AGE_TEST: "biological_age_test",
};

export const PLAN_FEATURES: Record<string, PlanFeature> = {
  [FEATURES.AI_HEALTH_ANALYSIS]: {
    name: "Анализ здоровья с помощью ИИ",
    description: "Базовый анализ состояния здоровья с использованием искусственного интеллекта",
    includedIn: { basic: true, standard: true, premium: true }
  },
  [FEATURES.BLOOD_ANALYSIS]: {
    name: "Интерпретация анализов крови",
    description: "Расшифровка и объяснение результатов анализов крови",
    includedIn: { basic: true, standard: true, premium: true }
  },
  [FEATURES.PERSONALIZED_RECOMMENDATIONS]: {
    name: "Персонализированные рекомендации",
    description: "Индивидуальные рекомендации по улучшению здоровья",
    includedIn: { basic: false, standard: true, premium: true }
  },
  [FEATURES.SUPPLEMENTS_SELECTION]: {
    name: "Подбор витаминов и добавок",
    description: "Персонализированный подбор витаминов и добавок",
    includedIn: { basic: false, standard: true, premium: true }
  },
  [FEATURES.HEALTH_MONITORING]: {
    name: "Мониторинг состояния здоровья",
    description: "Непрерывный мониторинг показателей здоровья",
    includedIn: { basic: false, standard: false, premium: true }
  },
  [FEATURES.COMPREHENSIVE_ASSESSMENT]: {
    name: "Комплексная оценка здоровья",
    description: "Полная комплексная оценка состояния здоровья",
    includedIn: { basic: false, standard: false, premium: true }
  },
  [FEATURES.BIOLOGICAL_AGE_TEST]: {
    name: "Тест на биологический возраст",
    description: "Определение биологического возраста на основе ИИ",
    includedIn: { basic: false, standard: false, premium: true }
  },
};
