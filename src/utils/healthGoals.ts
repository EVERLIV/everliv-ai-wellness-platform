
import { DatabaseHealthGoal, HealthGoal, GOAL_TYPE_CONFIG, GoalType } from '@/types/healthGoals';

export class HealthGoalMapper {
  static fromDatabase(dbGoal: DatabaseHealthGoal): HealthGoal {
    const goalType = this.determineGoalType(dbGoal);
    const config = GOAL_TYPE_CONFIG[goalType];
    
    return {
      id: dbGoal.id,
      user_id: dbGoal.user_id,
      goal_type: goalType,
      title: this.generateTitle(goalType, dbGoal),
      description: `${goalType} health goal`,
      target_value: this.getTargetValue(goalType, dbGoal),
      current_value: 0,
      unit: config?.unit || '',
      category: config?.category || 'fitness',
      priority: 'medium',
      start_date: dbGoal.start_date,
      target_date: dbGoal.end_date,
      is_active: dbGoal.is_active,
      is_custom: false,
      progress_percentage: 0,
      created_at: dbGoal.created_at,
      updated_at: dbGoal.updated_at,
    };
  }

  static toDatabase(goal: HealthGoal, userId: string): DatabaseHealthGoal {
    const baseData: DatabaseHealthGoal = {
      id: goal.id || '',
      user_id: userId,
      goal_type: goal.goal_type,
      start_date: goal.start_date,
      end_date: goal.target_date,
      is_active: goal.is_active,
      target_steps: 10000,
      target_exercise_minutes: 30,
      target_sleep_hours: 8,
      target_water_intake: 8,
      target_stress_level: 3,
      created_at: goal.created_at || new Date().toISOString(),
      updated_at: goal.updated_at || new Date().toISOString(),
    };

    // Set specific target based on goal type
    const config = GOAL_TYPE_CONFIG[goal.goal_type as GoalType];
    if (config && goal.target_value) {
      (baseData as any)[config.dbField] = goal.target_value;
    }

    return baseData;
  }

  private static determineGoalType(dbGoal: DatabaseHealthGoal): GoalType {
    if (dbGoal.target_weight) return 'weight';
    if (dbGoal.target_steps > 10000) return 'steps';
    if (dbGoal.target_exercise_minutes > 30) return 'exercise';
    if (dbGoal.target_sleep_hours > 8) return 'sleep';
    if (dbGoal.target_water_intake > 8) return 'water';
    if (dbGoal.target_stress_level < 5) return 'stress';
    return 'steps'; // default
  }

  private static generateTitle(goalType: GoalType, dbGoal: DatabaseHealthGoal): string {
    const config = GOAL_TYPE_CONFIG[goalType];
    const value = this.getTargetValue(goalType, dbGoal);
    return `${config?.title || goalType}: ${value} ${config?.unit || ''}`;
  }

  private static getTargetValue(goalType: GoalType, dbGoal: DatabaseHealthGoal): number {
    const config = GOAL_TYPE_CONFIG[goalType];
    if (!config) return 0;
    
    return (dbGoal as any)[config.dbField] || config.defaultTarget;
  }
}

export const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};

export const formatGoalValue = (value: number, unit: string): string => {
  return `${value.toLocaleString()} ${unit}`;
};
