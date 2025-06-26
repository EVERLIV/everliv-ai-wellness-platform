
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';
import { Target, Plus } from 'lucide-react';
import GoalCard from '@/components/health-goals/GoalCard';
import GoalForm from '@/components/health-goals/GoalForm';
import { HealthGoal, CreateHealthGoalInput } from '@/types/healthGoals';

const OptimizedHealthGoalsManager: React.FC = () => {
  const { goals, createGoal, updateGoal, deleteGoal, isLoading } = useOptimizedHealthGoals();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);

  const activeGoals = goals.filter(goal => goal.is_active);

  const handleCreateGoal = async (goalData: CreateHealthGoalInput) => {
    const success = await createGoal(goalData);
    if (success) {
      setIsFormOpen(false);
    }
    return success;
  };

  const handleEditGoal = (goal: HealthGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleUpdateGoal = async (goalData: CreateHealthGoalInput) => {
    if (!editingGoal?.id) return false;
    
    const success = await updateGoal(editingGoal.id, goalData);
    if (success) {
      setIsFormOpen(false);
      setEditingGoal(null);
    }
    return success;
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту цель?')) {
      await deleteGoal(goalId);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

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
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить цель
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isFormOpen ? (
          <GoalForm
            onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
            onCancel={handleCancel}
            initialData={editingGoal}
            isLoading={false}
          />
        ) : activeGoals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Нет активных целей</h3>
            <p className="text-gray-500 mb-4">Создайте свою первую цель для здоровья</p>
            <Button onClick={() => setIsFormOpen(true)}>
              Создать цель
            </Button>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedHealthGoalsManager;
