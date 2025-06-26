
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
});

// TypeScript типы
export type HealthRecommendation = z.infer<typeof HealthRecommendationSchema>;
export type RecommendationCheckup = z.infer<typeof RecommendationCheckupSchema>;

export type CreateHealthRecommendationInput = Omit<HealthRecommendation, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type CreateCheckupInput = Omit<RecommendationCheckup, 'id' | 'created_at' | 'completed_at'>;

/**
 * Предустановленные типы рекомендаций
 */
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
  // Новые цели долголетия
  biological_age: {
    title: 'Улучшить биологический возраст',
    description: 'Снизить биологический возраст относительно хронологического через оптимизацию клеточных процессов, уменьшение воспалений и улучшение регенеративных функций организма',
    category: 'longevity' as const,
    type: 'longevity' as const,
  },
  cardiovascular: {
    title: 'Оптимизировать работу сердечно-сосудистой системы',
    description: 'Укрепить сердечную мышцу, улучшить кровообращение, нормализовать артериальное давление и снизить риск сердечно-сосудистых заболеваний',
    category: 'cardiovascular' as const,
    type: 'cardiovascular' as const,
  },
  cognitive: {
    title: 'Повысить когнитивные функции и здоровье мозга',
    description: 'Улучшить память, концентрацию, скорость мышления и защитить от нейродегенеративных заболеваний через стимуляцию нейропластичности',
    category: 'cognitive' as const,
    type: 'cognitive' as const,
  },
  musculoskeletal: {
    title: 'Укрепить костно-мышечную систему',
    description: 'Увеличить плотность костей, мышечную массу и силу, улучшить гибкость и координацию для предотвращения падений и травм в пожилом возрасте',
    category: 'musculoskeletal' as const,
    type: 'musculoskeletal' as const,
  },
  metabolism: {
    title: 'Оптимизировать метаболизм и гормональный баланс',
    description: 'Нормализовать уровень сахара в крови, улучшить инсулиновую чувствительность, стабилизировать гормональный фон и поддержать здоровый вес',
    category: 'metabolism' as const,
    type: 'metabolism' as const,
  },
  immunity: {
    title: 'Укрепить иммунную систему и детоксикацию',
    description: 'Повысить способность организма противостоять инфекциям, улучшить работу печени и почек, оптимизировать процессы очищения организма от токсинов',
    category: 'immunity' as const,
    type: 'immunity' as const,
  },
} as const;
