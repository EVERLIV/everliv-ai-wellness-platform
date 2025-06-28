
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomGoalInput, GOAL_CATEGORIES } from '@/hooks/useHealthGoalsManager';
import { Calendar, Target, Tag, AlertCircle, Sparkles, X } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-white/30">
        <DialogHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 -m-6 mb-6 p-6 border-b border-white/20">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Новая цель здоровья
              </span>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Создайте персональную цель для достижения ваших результатов
              </p>
            </div>
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-6 top-6 w-8 h-8 bg-white/70 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Название цели *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Например: Пить больше воды"
              className={`bg-white/70 border-white/50 focus:border-blue-500 ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Описание
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Опишите вашу цель подробнее..."
              rows={3}
              className="bg-white/70 border-white/50 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Категория *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className={`bg-white/70 border-white/50 focus:border-blue-500 ${errors.category ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-white/50">
                  {Object.entries(GOAL_CATEGORIES).map(([key, category]) => (
                    <SelectItem key={key} value={key} className="hover:bg-gray-50/70">
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Приоритет</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="bg-white/70 border-white/50 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-white/50">
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
          </div>

          {/* Target & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_value" className="text-sm font-medium text-gray-700">
                Целевое значение
              </Label>
              <Input
                id="target_value"
                type="number"
                value={formData.target_value || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  target_value: e.target.value ? Number(e.target.value) : undefined 
                }))}
                placeholder="100"
                className={`bg-white/70 border-white/50 focus:border-blue-500 ${errors.target_value ? 'border-red-500' : ''}`}
              />
              {errors.target_value && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.target_value}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
                Единица измерения
              </Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="кг, мин, раз..."
                className="bg-white/70 border-white/50 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-sm font-medium text-gray-700">
                Дата начала
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className="bg-white/70 border-white/50 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-sm font-medium text-gray-700">
                Дата окончания
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className={`bg-white/70 border-white/50 focus:border-blue-500 ${errors.end_date ? 'border-red-500' : ''}`}
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

        <DialogFooter className="bg-gradient-to-r from-gray-50/50 to-gray-100/50 -m-6 mt-6 p-6 border-t border-white/20">
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
              className="flex-1 bg-white/70 border-white/50 hover:bg-white/80"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Сохранение...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Создать цель
                </div>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomGoalModal;
