
export interface PersonalRecommendation {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'medical' | 'lifestyle';
  priority: 'low' | 'medium' | 'high';
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  source_data?: any;
}

export interface HealthGoal {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  target_date?: string;
  is_active: boolean;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  progress_percentage: number;
  target_weight?: number;
  target_steps: number;
  target_exercise_minutes: number;
  target_sleep_hours: number;
  target_water_intake: number;
  target_stress_level: number;
  goal_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date?: string;
  end_date?: string;
}
