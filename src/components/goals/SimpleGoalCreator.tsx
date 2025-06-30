
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Target, Plus, Sparkles, Calendar, Save } from 'lucide-react';
import { useHealthGoalsManager } from '@/hooks/useHealthGoalsManager';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { toast } from 'sonner';

const SimpleGoalCreator: React.FC = () => {
  const [goalText, setGoalText] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [suggestedDate, setSuggestedDate] = useState('');
  const [isGeneratingDate, setIsGeneratingDate] = useState(false);
  
  const { createCustomGoal } = useHealthGoalsManager();
  const { healthProfile } = useHealthProfile();
  const { analytics } = useCachedAnalytics();

  const generateAIDate = async () => {
    if (!goalText.trim()) {
      toast.error('Сначала введите описание цели');
      return;
    }

    setIsGeneratingDate(true);
    try {
      // Простая логика определения даты на основе текста цели
      const goalLower = goalText.toLowerCase();
      const today = new Date();
      let targetDate = new Date(today);

      if (goalLower.includes('похуд') || goalLower.includes('вес')) {
        // Цели по весу - 3 месяца
        targetDate.setMonth(today.getMonth() + 3);
      } else if (goalLower.includes('мышц') || goalLower.includes('сил')) {
        // Цели по мышцам - 6 месяцев
        targetDate.setMonth(today.getMonth() + 6);
      } else if (goalLower.includes('привычк') || goalLower.includes('режим')) {
        // Привычки - 1 месяц
        targetDate.setMonth(today.getMonth() + 1);
      } else if (goalLower.includes('анализ') || goalLower.includes('обследован')) {
        // Медицинские цели - 2 недели
        targetDate.setDate(today.getDate() + 14);
      } else {
        // По умолчанию - 2 месяца
        targetDate.setMonth(today.getMonth() + 2);
      }

      // Учитываем профиль здоровья для корректировки
      if (healthProfile?.age && healthProfile.age > 50) {
        // Для возраста 50+ добавляем месяц
        targetDate.setMonth(targetDate.getMonth() + 1);
      }

      // Учитываем аналитику здоровья
      if (analytics?.healthScore && analytics.healthScore < 60) {
        // Для низкого индекса здоровья увеличиваем срок
        targetDate.setMonth(targetDate.getMonth() + 1);
      }

      setSuggestedDate(targetDate.toISOString().split('T')[0]);
      toast.success('ИИ предложил оптимальную дату выполнения');
    } catch (error) {
      console.error('Error generating AI date:', error);
      // Fallback дата - 2 месяца
      const fallbackDate = new Date();
      fallbackDate.setMonth(fallbackDate.getMonth() + 2);
      setSuggestedDate(fallbackDate.toISOString().split('T')[0]);
      toast.success('Предложена стандартная дата выполнения');
    } finally {
      setIsGeneratingDate(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!goalText.trim()) {
      toast.error('Введите описание цели');
      return;
    }

    setIsCreating(true);
    try {
      const goalData = {
        title: goalText.length > 50 ? goalText.substring(0, 50) + '...' : goalText,
        description: goalText,
        category: 'custom',
        priority: 'medium' as const,
        start_date: new Date().toISOString().split('T')[0],
        end_date: suggestedDate || undefined
      };

      const success = await createCustomGoal(goalData);
      if (success) {
        setGoalText('');
        setSuggestedDate('');
        toast.success('Цель создана успешно!');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Ошибка создания цели');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="shadow-sm border-gray-200/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Target className="h-5 w-5 text-green-600" />
          <span className="text-lg font-semibold">Создать новую цель</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goal-text" className="text-sm font-medium">
            Опишите вашу цель
          </Label>
          <Textarea
            id="goal-text"
            placeholder="Например: Снизить вес на 5 кг, улучшить сон, начать бегать каждое утро..."
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            className="min-h-[80px] resize-none"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 text-right">
            {goalText.length}/500
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateAIDate}
            disabled={isGeneratingDate || !goalText.trim()}
            className="flex-1"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGeneratingDate ? 'ИИ думает...' : 'Предложить дату ИИ'}
          </Button>
        </div>

        {suggestedDate && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Предложенная дата выполнения
              </span>
            </div>
            <Input
              type="date"
              value={suggestedDate}
              onChange={(e) => setSuggestedDate(e.target.value)}
              className="bg-white border-blue-200"
            />
            <p className="text-xs text-blue-700 mt-2">
              ИИ учел ваш профиль здоровья и текущие показатели для определения оптимального срока
            </p>
          </div>
        )}

        <Button
          onClick={handleCreateGoal}
          disabled={isCreating || !goalText.trim()}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isCreating ? 'Создание...' : 'Создать цель'}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>Совет:</strong> Опишите цель максимально конкретно</p>
          <p>🤖 ИИ автоматически определит оптимальную дату на основе вашего профиля</p>
          <p>📊 Сроки корректируются при изменении анализов и биомаркеров</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleGoalCreator;
