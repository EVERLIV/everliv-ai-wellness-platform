
import { z } from 'zod';

/**
 * Схема для рекомендации по здоровью
 */
export const HealthRecommendationSchema = z.object({
  /** Уникальный идентификатор */
  id: z.string().uuid().optional(),
  /** ID пользователя */
  user_id: z.string().uuid(),
  /** Заголовок рекомендации */
  title: z.string().min(1, 'Заголовок обязателен'),
  /** Описание рекомендации */
  description: z.string(),
  /** Тип рекомендации */
  type: z.enum(['steps', 'exercise', 'nutrition', 'sleep', 'stress', 'water', 'longevity', 'cardiovascular', 'cognitive', 'musculoskeletal', 'metabolism', 'immunity', 'custom']),
  /** Категория здоровья */
  category: z.enum(['fitness', 'nutrition', 'sleep', 'mental', 'longevity', 'cardiovascular', 'cognitive', 'musculoskeletal', 'metabolism', 'immunity']),
  /** Приоритет выполнения */
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  /** Статус рекомендации */
  status: z.enum(['active', 'completed', 'paused', 'archived']).default('active'),
  /** Дата создания */
  created_at: z.string().optional(),
  /** Дата обновления */
  updated_at: z.string().optional(),
  /** Связанные цели долголетия */
  longevity_goals: z.array(z.string()).optional(),
  /** Метаданные для аналитики */
  analytics_data: z.record(z.any()).optional(),
});

/**
 * Схема для чекапа рекомендации
 */
export const RecommendationCheckupSchema = z.object({
  /** Уникальный идентификатор */
  id: z.string().uuid().optional(),
  /** ID рекомендации */
  recommendation_id: z.string().uuid(),
  /** ID пользователя */
  user_id: z.string().uuid(),
  /** Название чекапа */
  title: z.string(),
  /** Описание чекапа */
  description: z.string(),
  /** Дата запланированного чекапа */
  scheduled_date: z.string(),
  /** Статус чекапа */
  status: z.enum(['pending', 'completed', 'skipped']).default('pending'),
  /** Результат чекапа */
  result: z.string().optional(),
  /** Оценка от 1 до 10 */
  rating: z.number().min(1).max(10).optional(),
  /** Дата создания */
  created_at: z.string().optional(),
  /** Дата завершения */
  completed_at: z.string().optional(),
  /** Связанные цели */
  related_goals: z.array(z.string()).optional(),
});

/**
 * Схема для журнала активности
 */
export const ActivityLogSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  action_type: z.enum(['profile_created', 'recommendation_generated', 'checkup_created', 'checkup_completed', 'goal_selected', 'data_uploaded', 'analysis_performed']),
  action_description: z.string(),
  related_id: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string(),
});

// TypeScript типы
export type HealthRecommendation = z.infer<typeof HealthRecommendationSchema>;
export type RecommendationCheckup = z.infer<typeof RecommendationCheckupSchema>;
export type ActivityLog = z.infer<typeof ActivityLogSchema>;

export type CreateHealthRecommendationInput = Omit<HealthRecommendation, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type CreateCheckupInput = Omit<RecommendationCheckup, 'id' | 'created_at' | 'completed_at'>;

/**
 * Предустановленные цели долголетия с улучшенными названиями
 */
export const LONGEVITY_GOALS = {
  biological_age: {
    title: 'Улучшить биологический возраст',
    description: 'Снизить биологический возраст относительно хронологического через оптимизацию клеточных процессов, уменьшение воспалений и улучшение регенеративных функций организма',
    category: 'longevity' as const,
    type: 'longevity' as const,
    requiredAnalyses: ['теломеры', 'маркеры воспаления', 'гормональный статус'],
  },
  cardiovascular: {
    title: 'Оптимизировать сердечно-сосудистую систему',
    description: 'Укрепить сердечную мышцу, улучшить кровообращение, нормализовать артериальное давление и снизить риск сердечно-сосудистых заболеваний',
    category: 'cardiovascular' as const,
    type: 'cardiovascular' as const,
    requiredAnalyses: ['липидограмма', 'артериальное давление', 'ЭКГ'],
  },
  cognitive: {
    title: 'Повысить когнитивные функции',
    description: 'Улучшить память, концентрацию, скорость мышления и защитить от нейродегенеративных заболеваний через стимуляцию нейропластичности',
    category: 'cognitive' as const,
    type: 'cognitive' as const,
    requiredAnalyses: ['нейропсихологическое тестирование', 'витамин B12', 'фолиевая кислота'],
  },
  musculoskeletal: {
    title: 'Укрепить костно-мышечную систему',
    description: 'Увеличить плотность костей, мышечную массу и силу, улучшить гибкость и координацию для предотвращения падений и травм',
    category: 'musculoskeletal' as const,
    type: 'musculoskeletal' as const,
    requiredAnalyses: ['денситометрия', 'витамин D', 'кальций'],
  },
  metabolism: {
    title: 'Оптимизировать метаболизм',
    description: 'Нормализовать уровень сахара в крови, улучшить инсулиновую чувствительность, стабилизировать гормональный фон и поддержать здоровый вес',
    category: 'metabolism' as const,
    type: 'metabolism' as const,
    requiredAnalyses: ['глюкоза', 'инсулин', 'HbA1c', 'гормоны щитовидной железы'],
  },
  immunity: {
    title: 'Укрепить иммунную систему',
    description: 'Повысить способность организма противостоять инфекциям, улучшить работу печени и почек, оптимизировать процессы очищения организма от токсинов',
    category: 'immunity' as const,
    type: 'immunity' as const,
    requiredAnalyses: ['иммунограмма', 'общий анализ крови', 'печеночные пробы'],
  },
} as const;

export const RECOMMENDATION_PRESETS = {
  steps: {
    title: 'Увеличить ежедневную активность',
    description: 'Постепенно увеличивайте количество шагов до 10,000 в день',
    category: 'fitness' as const,
    type: 'steps' as const,
  },
  exercise: {
    title: 'Регулярные тренировки',
    description: 'Занимайтесь физическими упражнениями минимум 30 минут в день',
    category: 'fitness' as const,
    type: 'exercise' as const,
  },
  nutrition: {
    title: 'Улучшить питание',
    description: 'Сбалансированное питание с достаточным количеством овощей и фруктов',
    category: 'nutrition' as const,
    type: 'nutrition' as const,
  },
  sleep: {
    title: 'Оптимизировать сон',
    description: 'Спать 7-9 часов в сутки, соблюдать режим сна',
    category: 'sleep' as const,
    type: 'sleep' as const,
  },
  stress: {
    title: 'Управление стрессом',
    description: 'Практиковать медитацию, дыхательные упражнения',
    category: 'mental' as const,
    type: 'stress' as const,
  },
  water: {
    title: 'Питьевой режим',
    description: 'Выпивать достаточное количество чистой воды (8-10 стаканов)',
    category: 'nutrition' as const,
    type: 'water' as const,
  },
  ...LONGEVITY_GOALS,
} as const;
