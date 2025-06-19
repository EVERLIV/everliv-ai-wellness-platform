
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
  id: string;
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
}
