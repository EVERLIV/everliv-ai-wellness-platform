
import { z } from 'zod';

/**
 * Zod schema for complete health goal validation
 * Defines the structure and validation rules for health goals
 */
export const HealthGoalSchema = z.object({
  /** Unique identifier for the goal (auto-generated) */
  id: z.string().uuid().optional(),
  /** User ID who owns the goal */
  user_id: z.string().uuid(),
  /** Display title for the goal */
  title: z.string().min(1, 'Title is required'),
  /** Optional detailed description */
  description: z.string().optional(),
  /** Type of health goal being tracked */
  goal_type: z.enum(['steps', 'exercise', 'weight', 'sleep', 'water', 'stress', 'custom']),
  /** Health category this goal belongs to */
  category: z.enum(['fitness', 'nutrition', 'sleep', 'mental', 'longevity']),
  /** Priority level for goal completion */
  priority: z.enum(['low', 'medium', 'high']),
  /** Target value to achieve (optional for some goal types) */
  target_value: z.number().positive().optional(),
  /** Current progress value */
  current_value: z.number().min(0).default(0),
  /** Unit of measurement for the goal */
  unit: z.string().optional(),
  /** Date when goal tracking started */
  start_date: z.string(),
  /** Optional target completion date */
  target_date: z.string().optional(),
  /** Whether this goal is currently active */
  is_active: z.boolean().default(true),
  /** Whether this is a custom user-defined goal */
  is_custom: z.boolean().default(false),
  /** Percentage of goal completion (0-100) */
  progress_percentage: z.number().min(0).max(100).default(0),
  /** Timestamp when goal was created */
  created_at: z.string().optional(),
  /** Timestamp when goal was last updated */
  updated_at: z.string().optional(),
});

/**
 * Schema for creating new health goals
 * Omits auto-generated fields like id, user_id, timestamps
 */
export const CreateHealthGoalSchema = HealthGoalSchema.omit({ 
  id: true, 
  user_id: true, 
  created_at: true, 
  updated_at: true 
});

/**
 * Schema for updating existing health goals
 * Makes all fields optional except id and user_id
 */
export const UpdateHealthGoalSchema = HealthGoalSchema.partial().omit({ 
  id: true, 
  user_id: true 
});

// TypeScript types derived from Zod schemas
/** Complete health goal object */
export type HealthGoal = z.infer<typeof HealthGoalSchema>;

/** Input type for creating new goals */
export type CreateHealthGoalInput = z.infer<typeof CreateHealthGoalSchema>;

/** Input type for updating existing goals */
export type UpdateHealthGoalInput = z.infer<typeof UpdateHealthGoalSchema>;

/**
 * Database table structure for user_health_goals
 * Maps to the actual Supabase table schema
 */
export interface DatabaseHealthGoal {
  id: string;
  user_id: string;
  target_weight?: number;
  target_steps: number;
  target_exercise_minutes: number;
  target_sleep_hours: number;
  target_water_intake: number;
  target_stress_level: number;
  goal_type: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Configuration for different goal types
 * Defines metadata, defaults, and database field mappings
 */
export const GOAL_TYPE_CONFIG = {
  steps: {
    title: 'Daily Steps',
    category: 'fitness' as const,
    unit: 'steps',
    defaultTarget: 10000,
    dbField: 'target_steps'
  },
  exercise: {
    title: 'Exercise Minutes',
    category: 'fitness' as const,
    unit: 'minutes',
    defaultTarget: 30,
    dbField: 'target_exercise_minutes'
  },
  sleep: {
    title: 'Sleep Hours',
    category: 'sleep' as const,
    unit: 'hours',
    defaultTarget: 8,
    dbField: 'target_sleep_hours'
  },
  water: {
    title: 'Water Intake',
    category: 'nutrition' as const,
    unit: 'glasses',
    defaultTarget: 8,
    dbField: 'target_water_intake'
  },
  weight: {
    title: 'Target Weight',
    category: 'fitness' as const,
    unit: 'kg',
    defaultTarget: 70,
    dbField: 'target_weight'
  },
  stress: {
    title: 'Stress Level',
    category: 'mental' as const,
    unit: 'level',
    defaultTarget: 3,
    dbField: 'target_stress_level'
  }
} as const;

/** Valid goal type keys */
export type GoalType = keyof typeof GOAL_TYPE_CONFIG;
