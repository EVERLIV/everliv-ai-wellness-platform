
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Zap,
  Heart,
  Brain,
  Activity,
  Utensils,
  Moon
} from 'lucide-react';
import { useHealthGoals, HealthGoal } from '@/hooks/useHealthGoals';
import HealthGoalDialog from './HealthGoalDialog';

const HealthGoalsSection: React.FC = () => {
  const { goals, isLoading, updateProgress, deleteGoal } = useHealthGoals();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Activity className="h-4 w-4" />;
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'mental': return <Brain className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'longevity': return <Heart className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const handleEdit = (goal: HealthGoal) => {
    setEditingGoal(goal);
    setDialogOpen(true);
  };

  const handleNewGoal = () => {
    setEditingGoal(null);
    setDialogOpen(true);
  };

  const activeGoals = goals.filter(goal => goal.is_active);
  const completedGoals = goals.filter(goal => goal.progress_percentage >= 100);

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Цели здоровья
            </CardTitle>
            <Button onClick={handleNewGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить цель
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Нет активных целей</h3>
              <p className="text-gray-500 mb-4">Создайте свою первую цель для здоровья</p>
              <Button onClick={handleNewGoal}>
                Создать цель
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        )}
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
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(goal)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteGoal(goal.id!)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс</span>
                      <span>{goal.progress_percentage}%</span>
                    </div>
                    <Progress value={goal.progress_percentage} className="h-2" />
                    
                    {goal.target_value && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Текущее: {goal.current_value || 0} {goal.unit}</span>
                        <span>Цель: {goal.target_value} {goal.unit}</span>
                      </div>
                    )}
                    
                    {goal.target_date && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>До: {new Date(goal.target_date).toLocaleDateString('ru-RU')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Выполненные цели
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">{goal.title}</span>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Выполнено
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <HealthGoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingGoal={editingGoal}
      />
    </div>
  );
};

export default HealthGoalsSection;
