
/**
 * @fileoverview Optimized Health Goals Manager Component
 * 
 * Main container component for managing health goals. Provides a complete
 * interface for viewing, creating, editing, and deleting health goals with
 * optimized performance and user experience.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';
import { Target, Plus } from 'lucide-react';
import GoalCard from '@/components/health-goals/GoalCard';
import GoalForm from '@/components/health-goals/GoalForm';
import { HealthGoal, CreateHealthGoalInput } from '@/types/healthGoals';

/**
 * Optimized Health Goals Manager Component
 * 
 * Features:
 * - Complete CRUD operations for health goals
 * - Toggle between list view and form view
 * - Empty state handling with call-to-action
 * - Loading states and error handling
 * - Responsive design for mobile and desktop
 * - Confirmation dialogs for destructive actions
 * - Optimized performance with proper state management
 * 
 * State Management:
 * - Form visibility toggle
 * - Edit mode with goal pre-population
 * - Loading states for async operations
 * 
 * @example
 * ```typescript
 * // Simple usage in a page component
 * function HealthGoalsPage() {
 *   return (
 *     <div className="container mx-auto p-6">
 *       <OptimizedHealthGoalsManager />
 *     </div>
 *   );
 * }
 * ```
 */
const OptimizedHealthGoalsManager: React.FC = () => {
  // Health goals state and actions from optimized hook
  const { goals, createGoal, updateGoal, deleteGoal, isLoading } = useOptimizedHealthGoals();
  
  // Local component state for UI management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);

  // Filter active goals for display
  const activeGoals = goals.filter(goal => goal.is_active);

  /**
   * Handles creation of new health goals
   * Closes form on successful creation
   */
  const handleCreateGoal = async (goalData: CreateHealthGoalInput) => {
    const success = await createGoal(goalData);
    if (success) {
      setIsFormOpen(false);
    }
    return success;
  };

  /**
   * Initiates goal editing mode
   * Opens form with pre-populated data
   */
  const handleEditGoal = (goal: HealthGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  /**
   * Handles updating existing health goals
   * Resets edit state on successful update
   */
  const handleUpdateGoal = async (goalData: CreateHealthGoalInput) => {
    if (!editingGoal?.id) return false;
    
    const success = await updateGoal(editingGoal.id, goalData);
    if (success) {
      setIsFormOpen(false);
      setEditingGoal(null);
    }
    return success;
  };

  /**
   * Handles goal deletion with confirmation
   * Shows browser confirmation dialog before deletion
   */
  const handleDeleteGoal = async (goalId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту цель?')) {
      await deleteGoal(goalId);
    }
  };

  /**
   * Handles form cancellation
   * Resets all form-related state
   */
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  // Loading state display
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Загрузка целей...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Цели здоровья
          </CardTitle>
          
          {/* Add Goal Button - only show when not in form mode */}
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить цель
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Form View */}
        {isFormOpen ? (
          <GoalForm
            onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
            onCancel={handleCancel}
            initialData={editingGoal}
            isLoading={false}
          />
        ) : (
          /* List View or Empty State */
          activeGoals.length === 0 ? (
            /* Empty State */
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Нет активных целей
              </h3>
              <p className="text-gray-500 mb-4">
                Создайте свою первую цель для здоровья
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                Создать цель
              </Button>
            </div>
          ) : (
            /* Goals List */
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedHealthGoalsManager;
