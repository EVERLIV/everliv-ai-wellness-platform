
/**
 * @fileoverview Goal Form Component for Health Goals System
 * 
 * Comprehensive form component for creating and editing health goals.
 * Features React Hook Form integration, Zod validation, responsive design,
 * and proper accessibility support.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CreateHealthGoalSchema, CreateHealthGoalInput, HealthGoal } from '@/types/healthGoals';

/**
 * Props for the GoalForm component
 */
interface GoalFormProps {
  /** Function called when form is submitted successfully */
  onSubmit: (data: CreateHealthGoalInput) => Promise<boolean>;
  /** Function called when user cancels form */
  onCancel: () => void;
  /** Optional initial data for editing existing goals */
  initialData?: HealthGoal | null;
  /** Loading state during form submission */
  isLoading?: boolean;
}

/**
 * Health Goal Form Component
 * 
 * Features:
 * - React Hook Form with Zod validation
 * - Responsive grid layout (1 column mobile, 2 columns desktop)
 * - Real-time validation with error messages
 * - Pre-populated fields for editing mode
 * - Accessible form controls with proper labels
 * - Loading states and disabled submission during processing
 * 
 * Form Fields:
 * - Title (required): Goal name/description
 * - Category (required): Health category selection
 * - Target Value: Numeric goal target
 * - Unit: Measurement unit for target
 * - Priority: Low/Medium/High importance
 * - Target Date: Optional completion deadline
 * - Description: Optional detailed description
 * 
 * @example
 * ```typescript
 * <GoalForm
 *   onSubmit={handleCreateGoal}
 *   onCancel={() => setShowForm(false)}
 *   initialData={editingGoal}
 *   isLoading={isSubmitting}
 * />
 * ```
 */
const GoalForm: React.FC<GoalFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false 
}) => {
  // Initialize form with React Hook Form and Zod validation
  const form = useForm<CreateHealthGoalInput>({
    resolver: zodResolver(CreateHealthGoalSchema),
    defaultValues: {
      title: '',
      description: '',
      goal_type: 'steps',
      category: 'fitness',
      priority: 'medium',
      target_value: 0,
      unit: '',
      start_date: new Date().toISOString().split('T')[0],
      target_date: '',
      is_active: true,
      is_custom: true,
      progress_percentage: 0
    }
  });

  // Populate form when editing existing goal
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description || '',
        goal_type: initialData.goal_type,
        category: initialData.category,
        priority: initialData.priority,
        target_value: initialData.target_value || 0,
        unit: initialData.unit || '',
        start_date: initialData.start_date,
        target_date: initialData.target_date || '',
        is_active: initialData.is_active,
        is_custom: initialData.is_custom,
        progress_percentage: initialData.progress_percentage
      });
    }
  }, [initialData, form]);

  /**
   * Handles form submission with validation and error handling
   */
  const handleSubmit = async (data: CreateHealthGoalInput) => {
    const success = await onSubmit(data);
    if (success) {
      form.reset();
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Goal Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название цели</FormLabel>
                <FormControl>
                  <Input placeholder="Например: Пробежать 5км" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Selection */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Target Value */}
          <FormField
            control={form.control}
            name="target_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Целевое значение</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Введите числовую цель"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Measurement Unit */}
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Единица измерения</FormLabel>
                <FormControl>
                  <Input placeholder="км, кг, часов, шагов" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority Level */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Приоритет</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Target Date */}
          <FormField
            control={form.control}
            name="target_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата достижения</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description Field (Full Width) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Подробное описание цели, мотивация, дополнительные заметки"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={isLoading}
          >
            {isLoading 
              ? (initialData ? 'Обновление...' : 'Создание...') 
              : (initialData ? 'Обновить цель' : 'Создать цель')
            }
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GoalForm;
