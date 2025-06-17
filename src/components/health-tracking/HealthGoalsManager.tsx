
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHealthGoals } from '@/hooks/useHealthGoals';
import { Target, Edit, Check, X } from 'lucide-react';

const HealthGoalsManager: React.FC = () => {
  const { goals, activeGoal, saveGoal, deactivateGoal, isLoading } = useHealthGoals();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    target_weight: '',
    target_steps: 10000,
    target_exercise_minutes: 30,
    target_sleep_hours: 8.0,
    target_water_intake: 8.0,
    target_stress_level: 3,
    goal_type: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      ...formData,
      target_weight: formData.target_weight ? parseFloat(formData.target_weight) : undefined,
      start_date: new Date().toISOString().split('T')[0],
      is_active: true
    };

    const success = await saveGoal(goalData);
    if (success) {
      setIsEditing(false);
      setFormData({
        target_weight: '',
        target_steps: 10000,
        target_exercise_minutes: 30,
        target_sleep_hours: 8.0,
        target_water_intake: 8.0,
        target_stress_level: 3,
        goal_type: 'monthly'
      });
    }
  };

  const handleEditExisting = () => {
    if (activeGoal) {
      setFormData({
        target_weight: activeGoal.target_weight?.toString() || '',
        target_steps: activeGoal.target_steps,
        target_exercise_minutes: activeGoal.target_exercise_minutes,
        target_sleep_hours: activeGoal.target_sleep_hours,
        target_water_intake: activeGoal.target_water_intake,
        target_stress_level: activeGoal.target_stress_level,
        goal_type: activeGoal.goal_type
      });
      setIsEditing(true);
    }
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
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Цели здоровья
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeGoal && !isEditing ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Активная цель ({activeGoal.goal_type})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {activeGoal.target_weight && (
                  <div>
                    <span className="text-gray-600">Вес:</span> {activeGoal.target_weight} кг
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Шаги:</span> {activeGoal.target_steps.toLocaleString()}
                </div>
                <div>
                  <span className="text-gray-600">Упражнения:</span> {activeGoal.target_exercise_minutes} мин
                </div>
                <div>
                  <span className="text-gray-600">Сон:</span> {activeGoal.target_sleep_hours} ч
                </div>
                <div>
                  <span className="text-gray-600">Вода:</span> {activeGoal.target_water_intake} ст
                </div>
                <div>
                  <span className="text-gray-600">Стресс:</span> ≤{activeGoal.target_stress_level}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={handleEditExisting}>
                  <Edit className="h-4 w-4 mr-1" />
                  Изменить
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => deactivateGoal(activeGoal.id!)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Деактивировать
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="goal_type">Тип цели</Label>
              <Select 
                value={formData.goal_type} 
                onValueChange={(value: any) => setFormData({...formData, goal_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Ежедневная</SelectItem>
                  <SelectItem value="weekly">Еженедельная</SelectItem>
                  <SelectItem value="monthly">Ежемесячная</SelectItem>
                  <SelectItem value="yearly">Годовая</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_weight">Целевой вес (кг)</Label>
                <Input
                  id="target_weight"
                  type="number"
                  step="0.1"
                  value={formData.target_weight}
                  onChange={(e) => setFormData({...formData, target_weight: e.target.value})}
                  placeholder="Необязательно"
                />
              </div>
              <div>
                <Label htmlFor="target_steps">Целевые шаги</Label>
                <Input
                  id="target_steps"
                  type="number"
                  value={formData.target_steps}
                  onChange={(e) => setFormData({...formData, target_steps: parseInt(e.target.value) || 10000})}
                />
              </div>
              <div>
                <Label htmlFor="target_exercise_minutes">Упражнения (мин/день)</Label>
                <Input
                  id="target_exercise_minutes"
                  type="number"
                  value={formData.target_exercise_minutes}
                  onChange={(e) => setFormData({...formData, target_exercise_minutes: parseInt(e.target.value) || 30})}
                />
              </div>
              <div>
                <Label htmlFor="target_sleep_hours">Сон (часов)</Label>
                <Input
                  id="target_sleep_hours"
                  type="number"
                  step="0.5"
                  value={formData.target_sleep_hours}
                  onChange={(e) => setFormData({...formData, target_sleep_hours: parseFloat(e.target.value) || 8.0})}
                />
              </div>
              <div>
                <Label htmlFor="target_water_intake">Вода (стаканов)</Label>
                <Input
                  id="target_water_intake"
                  type="number"
                  step="0.5"
                  value={formData.target_water_intake}
                  onChange={(e) => setFormData({...formData, target_water_intake: parseFloat(e.target.value) || 8.0})}
                />
              </div>
              <div>
                <Label htmlFor="target_stress_level">Макс. уровень стресса</Label>
                <Input
                  id="target_stress_level"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.target_stress_level}
                  onChange={(e) => setFormData({...formData, target_stress_level: parseInt(e.target.value) || 3})}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Check className="h-4 w-4 mr-1" />
                {isEditing ? 'Обновить цель' : 'Создать цель'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Отмена
                </Button>
              )}
            </div>
          </form>
        )}

        {!activeGoal && !isEditing && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Нет активных целей</h3>
            <p className="text-gray-500 mb-4">Создайте цель для отслеживания прогресса</p>
            <Button onClick={() => setIsEditing(true)}>
              Создать первую цель
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthGoalsManager;
