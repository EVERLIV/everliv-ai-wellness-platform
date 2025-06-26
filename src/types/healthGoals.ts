
import { z } from 'zod';

// Zod schemas for validation
export const HealthGoalSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  goal_type: z.enum(['steps', 'exercise', 'weight', 'sleep', 'water', 'stress', 'custom']),
  category: z.enum(['fitness', 'nutrition', 'sleep', 'mental', 'longevity']),
  priority: z.enum(['low', 'medium', 'high']),
  target_value: z.number().positive().optional(),
  current_value: z.number().min(0).default(0),
  unit: z.string().optional(),
  start_date: z.string(),
  target_date: z.string().optional(),
  is_active: z.boolean().default(true),
  is_custom: z.boolean().default(false),
  progress_percentage: z.number().min(0).max(100).default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const CreateHealthGoalSchema = HealthGoalSchema.omit({ 
  id: true, 
  user_id: true, 
  created_at: true, 
  updated_at: true 
});

export const UpdateHealthGoalSchema = HealthGoalSchema.partial().omit({ 
  id: true, 
  user_id: true 
});

// TypeScript types derived from Zod schemas
export type HealthGoal = z.infer<typeof HealthGoalSchema>;
export type CreateHealthGoalInput = z.infer<typeof CreateHealthGoalSchema>;
export type UpdateHealthGoalInput = z.infer<typeof UpdateHealthGoalSchema>;

// Database mapping utilities
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

export type GoalType = keyof typeof GOAL_TYPE_CONFIG;
