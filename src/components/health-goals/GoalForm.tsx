
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateHealthGoalInput, HealthGoal } from '@/types/healthGoals';

interface GoalFormProps {
  onSubmit: (goalData: CreateHealthGoalInput) => Promise<boolean>;
  onCancel: () => void;
  initialData?: HealthGoal | null;
  isLoading?: boolean;
}

// Предустановленные комплексные цели
const PRESET_GOALS = [
  {
    title: 'Улучшить качество сна',
    description: 'Достичь 7-8 часов качественного сна каждую ночь',
    goal_type: 'sleep' as const,
    category: 'sleep' as const,
    priority: 'high' as const,
    target_value: 8,
    unit: 'часов',
    is_custom: false
  },
  {
    title: 'Увеличить физическую активность',
    description: 'Ходить не менее 10,000 шагов ежедневно',
    goal_type: 'steps' as const,
    category: 'fitness' as const,
    priority: 'high' as const,
    target_value: 10000,
    unit: 'шагов',
    is_custom: false
  },
  {
    title: 'Регулярные тренировки',
    description: 'Заниматься спортом минимум 30 минут в день',
    goal_type: 'exercise' as const,
    category: 'fitness' as const,
    priority: 'medium' as const,
    target_value: 30,
    unit: 'минут',
    is_custom: false
  },
  {
    title: 'Питьевой режим',
    description: 'Выпивать 8 стаканов воды в день',
    goal_type: 'water' as const,
    category: 'nutrition' as const,
    priority: 'medium' as const,
    target_value: 8,
    unit: 'стаканов',
    is_custom: false
  },
  {
    title: 'Управление стрессом',
    description: 'Поддерживать низкий уровень стресса (до 3 баллов)',
    goal_type: 'stress' as const,
    category: 'mental' as const,
    priority: 'high' as const,
    target_value: 3,
    unit: 'уровень',
    is_custom: false
  },
  {
    title: 'Достичь целевого веса',
    description: 'Достичь и поддерживать здоровый вес',
    goal_type: 'weight' as const,
    category: 'fitness' as const,
    priority: 'medium' as const,
    target_value: 70,
    unit: 'кг',
    is_custom: false
  }
];

const GoalForm: React.FC<GoalFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isCustomGoal, setIsCustomGoal] = useState(false);
  const [formData, setFormData] = useState<CreateHealthGoalInput>({
    title: '',
    description: '',
    goal_type: 'custom',
    category: 'fitness',
    priority: 'medium',
    target_value: 1,
    current_value: 0,
    unit: '',
    start_date: new Date().toISOString().split('T')[0],
    target_date: '',
    is_active: true,
    is_custom: true,
    progress_percentage: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        goal_type: initialData.goal_type,
        category: initialData.category,
        priority: initialData.priority,
        target_value: initialData.target_value,
        current_value: initialData.current_value,
        unit: initialData.unit || '',
        start_date: initialData.start_date,
        target_date: initialData.target_date || '',
        is_active: initialData.is_active,
        is_custom: initialData.is_custom,
        progress_percentage: initialData.progress_percentage
      });
      setIsCustomGoal(initialData.is_custom);
    }
  }, [initialData]);

  const handlePresetSelect = (presetTitle: string) => {
    setSelectedPreset(presetTitle);
    if (presetTitle === 'custom') {
      setIsCustomGoal(true);
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        is_custom: true
      }));
    } else {
      const preset = PRESET_GOALS.find(goal => goal.title === presetTitle);
      if (preset) {
        setIsCustomGoal(false);
        setFormData(prev => ({
          ...prev,
          ...preset,
          start_date: prev.start_date,
          target_date: prev.target_date
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      // Форма будет закрыта родительским компонентом
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!initialData && (
        <Card>
          <CardHeader>
            <CardTitle>Выберите цель</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {PRESET_GOALS.map((goal) => (
                <div
                  key={goal.title}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPreset === goal.title ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handlePresetSelect(goal.title)}
                >
                  <h4 className="font-medium">{goal.title}</h4>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
              ))}
              <div
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPreset === 'custom' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handlePresetSelect('custom')}
              >
                <h4 className="font-medium">Создать свою цель</h4>
                <p className="text-sm text-gray-600">Определите собственную цель здоровья</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(selectedPreset || initialData) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {initialData ? 'Редактировать цель' : 'Настройки цели'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCustomGoal && (
              <>
                <div>
                  <Label htmlFor="title">Название цели</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Например: Пробежать 5км"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Подробное описание цели"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
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
                    <Label htmlFor="priority">Приоритет</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
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
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_value">Целевое значение</Label>
                <Input
                  id="target_value"
                  type="number"
                  step="0.1"
                  value={formData.target_value || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_value: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="unit">Единица измерения</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="км, кг, часов"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="target_date">Дата достижения (опционально)</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : (initialData ? 'Обновить' : 'Создать')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
};

export default GoalForm;
