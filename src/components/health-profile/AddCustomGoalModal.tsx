
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomGoalInput, GOAL_CATEGORIES } from '@/hooks/useHealthGoalsManager';
import { Calendar, Target, Tag, AlertCircle } from 'lucide-react';

interface AddCustomGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: CustomGoalInput) => Promise<boolean>;
}

const AddCustomGoalModal: React.FC<AddCustomGoalModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<CustomGoalInput>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    target_value: undefined,
    unit: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название цели обязательно';
    }

    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }

    if (formData.target_value !== undefined && formData.target_value <= 0) {
      newErrors.target_value = 'Целевое значение должно быть больше 0';
    }

    if (formData.end_date && formData.end_date <= formData.start_date) {
      newErrors.end_date = 'Дата окончания должна быть позже даты начала';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await onSave(formData);
      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      target_value: undefined,
      unit: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: ''
    });
    setErrors({});
    onClose();
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Средний';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Добавить пользовательскую цель
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Название цели */}
          <div className="space-y-2">
            <Label htmlFor="title">Название цели *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Например: Пить больше воды"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Опишите вашу цель подробнее..."
              rows={3}
            />
          </div>

          {/* Категория */}
          <div className="space-y-2">
            <Label>Категория *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GOAL_CATEGORIES).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Приоритет */}
          <div className="space-y-2">
            <Label>Приоритет</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className={getPriorityColor('low')}>Низкий</span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className={getPriorityColor('medium')}>Средний</span>
                </SelectItem>
                <SelectItem value="high">
                  <span className={getPriorityColor('high')}>Высокий</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Целевое значение и единица измерения */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_value">Целевое значение</Label>
              <Input
                id="target_value"
                type="number"
                value={formData.target_value || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  target_value: e.target.value ? Number(e.target.value) : undefined 
                }))}
                placeholder="100"
                className={errors.target_value ? 'border-red-500' : ''}
              />
              {errors.target_value && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.target_value}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Единица измерения</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="кг, мин, раз..."
              />
            </div>
          </div>

          {/* Даты */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Дата начала</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Дата окончания</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className={errors.end_date ? 'border-red-500' : ''}
              />
              {errors.end_date && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.end_date}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить цель'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomGoalModal;
