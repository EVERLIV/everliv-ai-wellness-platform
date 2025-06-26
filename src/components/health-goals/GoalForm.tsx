
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

interface GoalFormProps {
  onSubmit: (data: CreateHealthGoalInput) => Promise<boolean>;
  onCancel: () => void;
  initialData?: HealthGoal | null;
  isLoading?: boolean;
}

const GoalForm: React.FC<GoalFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false 
}) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Единица измерения</FormLabel>
                <FormControl>
                  <Input placeholder="км, кг, часов" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="target_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата достижения</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Подробное описание цели"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {initialData ? 'Обновить цель' : 'Создать цель'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GoalForm;
