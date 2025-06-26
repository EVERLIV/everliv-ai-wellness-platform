
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSecureHealthGoals, HealthGoal } from '@/hooks/useSecureHealthGoals';

interface HealthGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGoal?: HealthGoal | null;
}

const HealthGoalDialog: React.FC<HealthGoalDialogProps> = ({
  open,
  onOpenChange,
  editingGoal
}) => {
  const { saveGoal, isLoading } = useSecureHealthGoals();
  const [formData, setFormData] = useState({
    target_weight: '',
    target_steps: '10000',
    target_exercise_minutes: '30',
    target_sleep_hours: '8',
    target_water_intake: '8',
    target_stress_level: '3',
    goal_type: 'monthly' as const,
    end_date: ''
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        target_weight: editingGoal.target_weight?.toString() || '',
        target_steps: editingGoal.target_steps?.toString() || '10000',
        target_exercise_minutes: editingGoal.target_exercise_minutes?.toString() || '30',
        target_sleep_hours: editingGoal.target_sleep_hours?.toString() || '8',
        target_water_intake: editingGoal.target_water_intake?.toString() || '8',
        target_stress_level: editingGoal.target_stress_level?.toString() || '3',
        goal_type: editingGoal.goal_type || 'monthly',
        end_date: editingGoal.end_date || ''
      });
    } else {
      setFormData({
        target_weight: '',
        target_steps: '10000',
        target_exercise_minutes: '30',
        target_sleep_hours: '8',
        target_water_intake: '8',
        target_stress_level: '3',
        goal_type: 'monthly',
        end_date: ''
      });
    }
  }, [editingGoal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      target_weight: formData.target_weight ? parseFloat(formData.target_weight) : undefined,
      target_steps: parseInt(formData.target_steps),
      target_exercise_minutes: parseInt(formData.target_exercise_minutes),
      target_sleep_hours: parseFloat(formData.target_sleep_hours),
      target_water_intake: parseFloat(formData.target_water_intake),
      target_stress_level: parseInt(formData.target_stress_level),
      goal_type: formData.goal_type,
      end_date: formData.end_date || undefined
    };

    const success = await saveGoal(goalData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingGoal ? 'Редактировать цель' : 'Создать новую цель'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_steps">Шаги в день</Label>
              <Input
                id="target_steps"
                type="number"
                value={formData.target_steps}
                onChange={(e) => setFormData(prev => ({ ...prev, target_steps: e.target.value }))}
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="target_exercise_minutes">Упражнения (мин)</Label>
              <Input
                id="target_exercise_minutes"
                type="number"
                value={formData.target_exercise_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, target_exercise_minutes: e.target.value }))}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_sleep_hours">Сон (часы)</Label>
              <Input
                id="target_sleep_hours"
                type="number"
                step="0.5"
                value={formData.target_sleep_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, target_sleep_hours: e.target.value }))}
                min="0"
                max="24"
              />
            </div>
            
            <div>
              <Label htmlFor="target_water_intake">Вода (стаканы)</Label>
              <Input
                id="target_water_intake"
                type="number"
                value={formData.target_water_intake}
                onChange={(e) => setFormData(prev => ({ ...prev, target_water_intake: e.target.value }))}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_weight">Целевой вес (кг)</Label>
              <Input
                id="target_weight"
                type="number"
                step="0.1"
                value={formData.target_weight}
                onChange={(e) => setFormData(prev => ({ ...prev, target_weight: e.target.value }))}
                placeholder="Опционально"
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="target_stress_level">Уровень стресса (1-10)</Label>
              <Input
                id="target_stress_level"
                type="number"
                value={formData.target_stress_level}
                onChange={(e) => setFormData(prev => ({ ...prev, target_stress_level: e.target.value }))}
                min="1"
                max="10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="goal_type">Тип цели</Label>
            <Select value={formData.goal_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, goal_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Ежедневная</SelectItem>
                <SelectItem value="weekly">Еженедельная</SelectItem>
                <SelectItem value="monthly">Месячная</SelectItem>
                <SelectItem value="yearly">Годовая</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="end_date">Дата окончания (опционально)</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : (editingGoal ? 'Обновить' : 'Создать')}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthGoalDialog;
