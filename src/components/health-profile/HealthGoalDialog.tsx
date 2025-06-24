
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Activity, 
  Utensils, 
  Brain, 
  Moon, 
  Heart,
  Plus
} from 'lucide-react';
import { useHealthGoals, HealthGoal } from '@/hooks/useHealthGoals';

interface HealthGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGoal?: HealthGoal | null;
}

const PRESET_GOALS = [
  {
    goal_type: 'biological_age',
    title: 'Улучшить биологический возраст',
    description: 'Снизить биологический возраст на 2-3 года через комплексные изменения образа жизни',
    category: 'longevity',
    priority: 'high' as const,
    target_value: 3,
    unit: 'года',
    icon: Heart
  },
  {
    goal_type: 'weight_loss',
    title: 'Снизить вес',
    description: 'Безопасное и устойчивое снижение веса',
    category: 'fitness',
    priority: 'medium' as const, 
    target_value: 5,
    unit: 'кг',
    icon: Activity
  },
  {
    goal_type: 'sleep_quality',
    title: 'Улучшить качество сна',
    description: 'Нормализовать режим сна и повысить его качество',
    category: 'sleep',
    priority: 'high' as const,
    target_value: 8,
    unit: 'часов',
    icon: Moon
  },
  {
    goal_type: 'stress_reduction',
    title: 'Снизить уровень стресса',
    description: 'Изучить техники управления стрессом и применять их ежедневно',
    category: 'mental',
    priority: 'medium' as const,
    target_value: 3,
    unit: 'уровень',
    icon: Brain
  },
  {
    goal_type: 'nutrition_improvement',
    title: 'Улучшить питание',
    description: 'Сбалансировать рацион и включить больше полезных продуктов',
    category: 'nutrition',
    priority: 'medium' as const,
    target_value: 80,
    unit: '%',
    icon: Utensils
  }
];

const HealthGoalDialog: React.FC<HealthGoalDialogProps> = ({
  open,
  onOpenChange,
  editingGoal
}) => {
  const { createGoal, updateGoal } = useHealthGoals();
  const [activeTab, setActiveTab] = useState('preset');
  const [formData, setFormData] = useState({
    goal_type: '',
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    target_value: 0,
    unit: '',
    target_date: '',
    start_date: new Date().toISOString().split('T')[0],
    is_custom: false,
    is_active: true,
    progress_percentage: 0
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        goal_type: editingGoal.goal_type || '',
        title: editingGoal.title || '',
        description: editingGoal.description || '',
        category: editingGoal.category || '',
        priority: editingGoal.priority || 'medium',
        target_value: editingGoal.target_value || 0,
        unit: editingGoal.unit || '',
        target_date: editingGoal.target_date || '',
        start_date: editingGoal.start_date || new Date().toISOString().split('T')[0],
        is_custom: editingGoal.is_custom || false,
        is_active: editingGoal.is_active ?? true,
        progress_percentage: editingGoal.progress_percentage || 0
      });
      setActiveTab('custom');
    } else {
      resetForm();
    }
  }, [editingGoal, open]);

  const resetForm = () => {
    setFormData({
      goal_type: '',
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      target_value: 0,
      unit: '',
      target_date: '',
      start_date: new Date().toISOString().split('T')[0],
      is_custom: false,
      is_active: true,
      progress_percentage: 0
    });
    setActiveTab('preset');
  };

  const handlePresetSelect = (preset: typeof PRESET_GOALS[0]) => {
    setFormData({
      ...formData,
      goal_type: preset.goal_type,
      title: preset.title,
      description: preset.description,
      category: preset.category,
      priority: preset.priority,
      target_value: preset.target_value,
      unit: preset.unit,
      is_custom: false
    });
    setActiveTab('custom');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    
    if (editingGoal) {
      success = await updateGoal(editingGoal.id!, formData);
    } else {
      success = await createGoal(formData);
    }
    
    if (success) {
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingGoal ? 'Редактировать цель' : 'Создать новую цель'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Готовые цели</TabsTrigger>
            <TabsTrigger value="custom">Своя цель</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-4">
            <div className="grid gap-3">
              {PRESET_GOALS.map((preset, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <preset.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{preset.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {preset.description}
                        </CardDescription>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{preset.category}</Badge>
                          <Badge variant={preset.priority === 'high' ? 'destructive' : 'default'}>
                            {preset.priority === 'high' ? 'Высокий' : 'Средний'} приоритет
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Название цели*</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Например: Пробежать марафон"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Категория*</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fitness">Фитнес</SelectItem>
                      <SelectItem value="nutrition">Питание</SelectItem>
                      <SelectItem value="mental">Ментальное здоровье</SelectItem>
                      <SelectItem value="sleep">Сон</SelectItem>
                      <SelectItem value="longevity">Долголетие</SelectItem>
                      <SelectItem value="medical">Медицинские показатели</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Подробное описание цели и как вы планируете её достичь"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="target_value">Целевое значение</Label>
                  <Input
                    id="target_value"
                    type="number"
                    step="0.1"
                    value={formData.target_value}
                    onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) || 0 })}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Единица измерения</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="кг, км, часов"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Приоритет</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: value })}
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

              <div>
                <Label htmlFor="target_date">Дата достижения цели</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingGoal ? 'Обновить цель' : 'Создать цель'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HealthGoalDialog;
