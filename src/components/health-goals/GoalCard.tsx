
/**
 * @fileoverview Goal Card Component for Health Goals System
 * 
 * Displays individual health goal information with progress visualization,
 * category icons, priority badges, and action buttons. Optimized for 
 * performance with React.memo and responsive design.
 */

import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, Clock, Target } from 'lucide-react';
import { HealthGoal } from '@/types/healthGoals';
import { formatGoalValue } from '@/utils/healthGoals';

/**
 * Props for the GoalCard component
 */
interface GoalCardProps {
  /** The health goal to display */
  goal: HealthGoal;
  /** Callback function when user clicks edit button */
  onEdit: (goal: HealthGoal) => void;
  /** Callback function when user clicks delete button */
  onDelete: (goalId: string) => void;
  /** Whether to show edit/delete action buttons */
  showActions?: boolean;
}

/**
 * Health Goal Card Component
 * 
 * Features:
 * - Progress visualization with color-coded progress bar
 * - Category-specific emoji icons
 * - Priority level badges with color coding
 * - Responsive layout for mobile and desktop
 * - Accessibility support with proper ARIA labels
 * - Performance optimization with React.memo
 * 
 * @example
 * ```typescript
 * <GoalCard
 *   goal={healthGoal}
 *   onEdit={handleEditGoal}
 *   onDelete={handleDeleteGoal}
 *   showActions={true}
 * />
 * ```
 */
const GoalCard: React.FC<GoalCardProps> = memo(({ 
  goal, 
  onEdit, 
  onDelete, 
  showActions = true 
}) => {
  /**
   * Returns appropriate badge variant for priority level
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  /**
   * Returns category-specific emoji icon
   */
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return '🏃‍♂️';
      case 'nutrition': return '🥗';
      case 'sleep': return '😴';
      case 'mental': return '🧠';
      case 'longevity': return '❤️';
      default: return '🎯';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Header with goal info and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {/* Category icon */}
            <div className="text-2xl">{getCategoryIcon(goal.category)}</div>
            
            {/* Goal information */}
            <div>
              <h4 className="font-semibold text-gray-900">{goal.title}</h4>
              {goal.description && (
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
              )}
              
              {/* Badges */}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getPriorityColor(goal.priority)}>
                  {goal.priority === 'high' ? 'Высокий' : 
                   goal.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                </Badge>
                <Badge variant="outline">{goal.category}</Badge>
                {goal.is_custom && <Badge variant="secondary">Пользовательская</Badge>}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          {showActions && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onEdit(goal)}
                aria-label={`Редактировать цель "${goal.title}"`}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onDelete(goal.id!)}
                aria-label={`Удалить цель "${goal.title}"`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Прогресс</span>
            <span>{goal.progress_percentage}%</span>
          </div>
          <Progress value={goal.progress_percentage} className="h-2" />
          
          {/* Target and current values */}
          {goal.target_value && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                <Target className="h-3 w-3 inline mr-1" />
                Текущее: {formatGoalValue(goal.current_value || 0, goal.unit || '')}
              </span>
              <span>Цель: {formatGoalValue(goal.target_value, goal.unit || '')}</span>
            </div>
          )}
          
          {/* Target date */}
          {goal.target_date && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-3 w-3" />
              <span>До: {new Date(goal.target_date).toLocaleDateString('ru-RU')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

// Display name for React DevTools debugging
GoalCard.displayName = 'GoalCard';

export default GoalCard;
