
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Edit, 
  Trash2, 
  Clock,
  Target,
  Activity,
  Utensils,
  Moon,
  Brain,
  Heart
} from 'lucide-react';
import { HealthGoal } from '@/types/healthGoals';

interface GoalCardProps {
  goal: HealthGoal;
  onEdit: (goal: HealthGoal) => void;
  onDelete: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
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

  return (
    <Card className="p-4 hover:bg-gray-50 transition-colors">
      <CardContent className="p-0">
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
            <Button size="sm" variant="outline" onClick={() => onEdit(goal)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onDelete(goal.id!)}
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
      </CardContent>
    </Card>
  );
};

export default GoalCard;
