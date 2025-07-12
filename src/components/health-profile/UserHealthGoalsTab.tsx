import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Plus, Edit, Trash2, Calendar as CalendarIcon, CheckCircle, Clock } from 'lucide-react';
import { useHealthGoalsManager } from '@/hooks/useHealthGoalsManager';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface NewGoal {
  title: string;
  description: string;
  category: string;
  priority: string;
  endDate?: Date;
}

const UserHealthGoalsTab: React.FC = () => {
  const { goals, createCustomGoal, deleteGoal, isLoading } = useHealthGoalsManager();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState<NewGoal>({
    title: '',
    description: '',
    category: 'fitness',
    priority: 'medium'
  });

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim()) return;

    const success = await createCustomGoal({
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      priority: newGoal.priority as 'low' | 'medium' | 'high',
      start_date: new Date().toISOString().split('T')[0],
      end_date: newGoal.endDate?.toISOString().split('T')[0] || undefined
    });

    if (success) {
      setNewGoal({
        title: '',
        description: '',
        category: 'fitness',
        priority: 'medium'
      });
      setShowCreateForm(false);
    }
  };

  const handleDeleteGoal = async (goalId: string | undefined) => {
    if (!goalId) return;
    await deleteGoal(goalId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Неизвестно';
    }
  };

  const getCategoryText = (category: string) => {
    const categories: Record<string, string> = {
      'fitness': 'Фитнес',
      'nutrition': 'Питание',
      'mental': 'Ментальное здоровье',
      'medical': 'Медицинские',
      'lifestyle': 'Образ жизни',
      'other': 'Другое'
    };
    return categories[category] || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка создания */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Мои цели здоровья</h2>
          <p className="text-muted-foreground">Создавайте и отслеживайте персональные цели</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Добавить цель
        </Button>
      </div>

      {/* Форма создания цели */}
      {showCreateForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Новая цель здоровья
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Название цели *</label>
                <Input
                  placeholder="Например: Сбросить 5 кг за 3 месяца"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Категория</label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Фитнес</SelectItem>
                    <SelectItem value="nutrition">Питание</SelectItem>
                    <SelectItem value="mental">Ментальное здоровье</SelectItem>
                    <SelectItem value="medical">Медицинские</SelectItem>
                    <SelectItem value="lifestyle">Образ жизни</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Описание</label>
              <Textarea
                placeholder="Подробное описание цели и план достижения..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Приоритет</label>
                <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({ ...newGoal, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="low">Низкий</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Дата достижения</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newGoal.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newGoal.endDate ? (
                        format(newGoal.endDate, "d MMMM yyyy", { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newGoal.endDate}
                      onSelect={(date) => setNewGoal({ ...newGoal, endDate: date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateGoal} disabled={!newGoal.title.trim()}>
                Создать цель
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список целей */}
      {goals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Пока нет целей</h3>
            <p className="text-muted-foreground mb-4">
              Создайте свою первую цель здоровья для отслеживания прогресса
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить первую цель
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{goal.title}</h3>
                      <Badge className={getPriorityColor(goal.priority || 'medium')}>
                        {getPriorityText(goal.priority || 'medium')}
                      </Badge>
                      <Badge variant="outline">
                        {getCategoryText(goal.category || 'other')}
                      </Badge>
                      {goal.is_active && (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Активная
                        </Badge>
                      )}
                    </div>

                    {goal.description && (
                      <p className="text-muted-foreground mb-3">{goal.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {goal.end_date && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            До: {format(new Date(goal.end_date), "d MMMM yyyy", { locale: ru })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Создана: {goal.created_at ? format(new Date(goal.created_at), "d MMMM", { locale: ru }) : 'Неизвестно'}
                        </span>
                      </div>
                      {goal.progress_percentage !== undefined && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Прогресс: {goal.progress_percentage}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserHealthGoalsTab;