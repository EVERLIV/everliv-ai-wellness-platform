
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHealthGoals, HealthGoal } from '@/hooks/useHealthGoals';
import { Target, Edit, Check, X } from 'lucide-react';

const HealthGoalsManager: React.FC = () => {
  const { goals, activeGoal, createGoal, deactivateGoal, isLoading } = useHealthGoals();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: '',
    category: 'fitness',
    priority: 'medium' as 'low' | 'medium' | 'high',
    target_value: 0,
    unit: '',
    target_date: '',
    is_custom: true,
    is_active: true,
    progress_percentage: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      ...formData,
      start_date: new Date().toISOString().split('T')[0],
    };

    const success = await createGoal(goalData);
    if (success) {
      setIsEditing(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      goal_type: '',
      category: 'fitness',
      priority: 'medium',
      target_value: 0,
      unit: '',
      target_date: '',
      is_custom: true,
      is_active: true,
      progress_percentage: 0
    });
  };

  const handleEditExisting = () => {
    if (activeGoal) {
      setFormData({
        title: activeGoal.title,
        description: activeGoal.description || '',
        goal_type: activeGoal.goal_type,
        category: activeGoal.category,
        priority: activeGoal.priority,
        target_value: activeGoal.target_value || 0,
        unit: activeGoal.unit || '',
        target_date: activeGoal.target_date || '',
        is_custom: activeGoal.is_custom,
        is_active: activeGoal.is_active,
        progress_percentage: activeGoal.progress_percentage
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
              <h3 className="font-semibold text-green-800 mb-2">{activeGoal.title}</h3>
              <p className="text-sm text-green-600 mb-3">{activeGoal.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Категория:</span> {activeGoal.category}
                </div>
                <div>
                  <span className="text-gray-600">Приоритет:</span> {activeGoal.priority}
                </div>
                {activeGoal.target_value && (
                  <div>
                    <span className="text-gray-600">Цель:</span> {activeGoal.target_value} {activeGoal.unit}
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Прогресс:</span> {activeGoal.progress_percentage}%
                </div>
              </div>
              <div className="flex gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Название цели</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Например: Пробежать 5км"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Категория</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Фитнес</SelectItem>
                    <SelectItem value="nutrition">Питание</SelectItem>
                    <SelectItem value="sleep">Сон</SelectItem>
                    <SelectItem value="mental">Ментальное здоровье</SelectItem>
                    <SelectItem value="longevity">Долголетие</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target_value">Целевое значение</Label>
                <Input
                  id="target_value"
                  type="number"
                  step="0.1"
                  value={formData.target_value}
                  onChange={(e) => setFormData({...formData, target_value: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="unit">Единица измерения</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  placeholder="км, кг, часов"
                />
              </div>
              <div>
                <Label htmlFor="priority">Приоритет</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({...formData, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target_date">Дата достижения</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Подробное описание цели"
              />
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
