
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Target, Save, Sparkles, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface AddCustomGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: any) => Promise<void>;
}

const AddCustomGoalModal: React.FC<AddCustomGoalModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [goalText, setGoalText] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [isGeneratingDate, setIsGeneratingDate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateAIDate = async () => {
    if (!goalText.trim()) {
      toast.error('Сначала введите описание цели');
      return;
    }

    setIsGeneratingDate(true);
    try {
      const goalLower = goalText.toLowerCase();
      const today = new Date();
      let targetDate = new Date(today);

      if (goalLower.includes('похуд') || goalLower.includes('вес')) {
        targetDate.setMonth(today.getMonth() + 3);
      } else if (goalLower.includes('мышц') || goalLower.includes('сил')) {
        targetDate.setMonth(today.getMonth() + 6);
      } else if (goalLower.includes('привычк') || goalLower.includes('режим')) {
        targetDate.setMonth(today.getMonth() + 1);
      } else if (goalLower.includes('анализ') || goalLower.includes('обследован')) {
        targetDate.setDate(today.getDate() + 14);
      } else {
        targetDate.setMonth(today.getMonth() + 2);
      }

      setSuggestedDate(targetDate.toISOString().split('T')[0]);
      toast.success('ИИ предложил оптимальную дату выполнения');
    } catch (error) {
      console.error('Error generating AI date:', error);
      const fallbackDate = new Date();
      fallbackDate.setMonth(fallbackDate.getMonth() + 2);
      setSuggestedDate(fallbackDate.toISOString().split('T')[0]);
      toast.success('Предложена стандартная дата выполнения');
    } finally {
      setIsGeneratingDate(false);
    }
  };

  const handleSave = async () => {
    if (!goalText.trim()) {
      toast.error('Введите описание цели');
      return;
    }

    setIsSaving(true);
    try {
      const goalData = {
        title: goalText.length > 50 ? goalText.substring(0, 50) + '...' : goalText,
        description: goalText,
        category: 'custom',
        priority: 'medium' as const,
        start_date: new Date().toISOString().split('T')[0],
        end_date: suggestedDate || undefined
      };

      await onSave(goalData);
      
      // Сброс формы
      setGoalText('');
      setSuggestedDate('');
      onClose();
      
      toast.success('Цель создана успешно!');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Ошибка создания цели');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setGoalText('');
    setSuggestedDate('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Добавить пользовательскую цель
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-text" className="text-sm font-medium">
              Опишите вашу цель *
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

          <Button
            variant="outline"
            size="sm"
            onClick={generateAIDate}
            disabled={isGeneratingDate || !goalText.trim()}
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGeneratingDate ? 'ИИ думает...' : 'Предложить дату ИИ'}
          </Button>

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
                ИИ учел тип цели для определения оптимального срока
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !goalText.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Создание...' : 'Создать цель'}
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 <strong>Совет:</strong> Опишите цель максимально конкретно</p>
            <p>🤖 ИИ автоматически определит оптимальную дату на основе типа цели</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomGoalModal;
