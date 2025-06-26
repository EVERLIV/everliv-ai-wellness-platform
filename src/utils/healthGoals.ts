
import { DatabaseHealthGoal, HealthGoal, GOAL_TYPE_CONFIG, GoalType } from '@/types/healthGoals';

/**
 * Utility class for transforming health goal data between application and database formats
 * Handles the mapping between the unified HealthGoal interface and the database schema
 */
export class HealthGoalMapper {
  /**
   * Transforms a database record into application format
   * @param dbGoal - Raw database record from user_health_goals table
   * @returns Normalized HealthGoal object for application use
   * 
   * @example
   * ```typescript
   * const dbRecord = await supabase.from('user_health_goals').select().single();
   * const appGoal = HealthGoalMapper.fromDatabase(dbRecord.data);
   * ```
   */
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

  /**
   * Transforms application format into database record
   * @param goal - HealthGoal object from application
   * @param userId - User ID to associate with the goal
   * @returns Database record ready for insertion/update
   * 
   * @example
   * ```typescript
   * const dbRecord = HealthGoalMapper.toDatabase(appGoal, user.id);
   * await supabase.from('user_health_goals').insert(dbRecord);
   * ```
   */
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

  /**
   * Determines the goal type based on database record values
   * Uses heuristics to identify the primary goal type from database fields
   * @private
   */
  private static determineGoalType(dbGoal: DatabaseHealthGoal): GoalType {
    if (dbGoal.target_weight) return 'weight';
    if (dbGoal.target_steps > 10000) return 'steps';
    if (dbGoal.target_exercise_minutes > 30) return 'exercise';
    if (dbGoal.target_sleep_hours > 8) return 'sleep';
    if (dbGoal.target_water_intake > 8) return 'water';
    if (dbGoal.target_stress_level < 5) return 'stress';
    return 'steps'; // default fallback
  }

  /**
   * Generates a display title for the goal based on type and target value
   * @private
   */
  private static generateTitle(goalType: GoalType, dbGoal: DatabaseHealthGoal): string {
    const config = GOAL_TYPE_CONFIG[goalType];
    const value = this.getTargetValue(goalType, dbGoal);
    return `${config?.title || goalType}: ${value} ${config?.unit || ''}`;
  }

  /**
   * Extracts the target value for a specific goal type from database record
   * @private
   */
  private static getTargetValue(goalType: GoalType, dbGoal: DatabaseHealthGoal): number {
    const config = GOAL_TYPE_CONFIG[goalType];
    if (!config) return 0;
    
    return (dbGoal as any)[config.dbField] || config.defaultTarget;
  }
}

/**
 * Calculates progress percentage based on current and target values
 * @param current - Current achievement value
 * @param target - Target goal value
 * @returns Progress percentage (0-100), capped at 100%
 * 
 * @example
 * ```typescript
 * const progress = calculateProgress(7500, 10000); // Returns 75
 * const overAchieved = calculateProgress(12000, 10000); // Returns 100
 * ```
 */
export const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};

/**
 * Formats goal values for display with proper localization
 * @param value - Numeric value to format
 * @param unit - Unit of measurement
 * @returns Formatted string with value and unit
 * 
 * @example
 * ```typescript
 * formatGoalValue(10000, 'steps'); // "10,000 steps"
 * formatGoalValue(8.5, 'hours'); // "8.5 hours"
 * ```
 */
export const formatGoalValue = (value: number, unit: string): string => {
  return `${value.toLocaleString()} ${unit}`;
};
