import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Target } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { useHealthGoalsManager } from "@/hooks/useHealthGoalsManager";
import { translateHealthGoal } from "@/utils/goalTranslations";
import { toast } from "sonner";
import AddCustomGoalModal from "./AddCustomGoalModal";

interface EditHealthGoalsModalProps {
  healthProfile: HealthProfileData;
  onUpdate: (updates: Partial<HealthProfileData>) => void;
  onSave: () => Promise<void>;
}

const EditHealthGoalsModal: React.FC<EditHealthGoalsModalProps> = ({
  healthProfile,
  onUpdate,
  onSave
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomGoalModal, setShowCustomGoalModal] = useState(false);
  const { goals, deleteGoal, createCustomGoal, refetch } = useHealthGoalsManager();

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const predefinedGoals = [
    { key: 'cognitive', label: 'Улучшение когнитивных функций' },
    { key: 'cardiovascular', label: 'Здоровье сердечно-сосудистой системы' },
    { key: 'weight_loss', label: 'Снижение веса' },
    { key: 'muscle_gain', label: 'Набор мышечной массы' },
    { key: 'energy_boost', label: 'Повышение энергии' },
    { key: 'sleep_improvement', label: 'Улучшение сна' },
    { key: 'stress_reduction', label: 'Снижение стресса' },
    { key: 'immunity_boost', label: 'Укрепление иммунитета' },
    { key: 'longevity', label: 'Увеличение продолжительности жизни' },
    { key: 'hormonal_balance', label: 'Гормональный баланс' },
    { key: 'digestive_health', label: 'Здоровье пищеварения' },
    { key: 'skin_health', label: 'Здоровье кожи' },
    { key: 'biological_age', label: 'Улучшение биологического возраста' },
    { key: 'metabolic_health', label: 'Метаболическое здоровье' },
    { key: 'bone_health', label: 'Здоровье костей' },
    { key: 'mental_health', label: 'Психическое здоровье' },
    { key: 'detox', label: 'Детоксикация организма' },
    { key: 'athletic_performance', label: 'Спортивные результаты' }
  ];

  const handleGoalChange = (goal: string, checked: boolean) => {
    const currentGoals = healthProfile.healthGoals || [];
    let newGoals;

    if (checked) {
      newGoals = [...currentGoals, goal];
    } else {
      newGoals = currentGoals.filter((g: string) => g !== goal);
    }

    onUpdate({ healthGoals: newGoals });
  };

  const handleDeleteCustomGoal = async (goalId: string) => {
    const success = await deleteGoal(goalId);
    if (success) {
      toast.success('Цель удалена');
      refetch();
    }
  };

  const handleAddCustomGoal = async (goalData: any) => {
    const success = await createCustomGoal(goalData);
    if (success) {
      toast.success('Цель добавлена');
      refetch();
    }
  };

  const handleSaveAndClose = async () => {
    try {
      await onSave();
      setIsOpen(false);
      toast.success('Цели здоровья обновлены');
    } catch (error) {
      toast.error('Ошибка при сохранении целей');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Не указан';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Редактировать цели
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Редактирование целей здоровья
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Предустановленные цели */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Выберите цели из списка</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {predefinedGoals.map((goal) => (
                  <div key={goal.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal.key}
                      checked={(healthProfile.healthGoals || []).includes(goal.key)}
                      onCheckedChange={(checked) => handleGoalChange(goal.key, !!checked)}
                    />
                    <Label htmlFor={goal.key} className="text-sm">{goal.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Пользовательские цели */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Ваши персональные цели</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomGoalModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Добавить
                </Button>
              </div>
              
              {goals.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {goals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        {goal.description && (
                          <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getPriorityColor(goal.priority)}`}>
                          {getPriorityText(goal.priority)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomGoal(goal.id)}
                        className="ml-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Пока нет персональных целей
                </p>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSaveAndClose}>
                Сохранить изменения
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно для создания пользовательской цели */}
      <AddCustomGoalModal
        isOpen={showCustomGoalModal}
        onClose={() => setShowCustomGoalModal(false)}
        onSave={handleAddCustomGoal}
      />
    </>
  );
};

export default EditHealthGoalsModal;