
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target, Calendar as CalendarIcon } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import AddCustomGoalModal from "./AddCustomGoalModal";
import { useHealthGoalsManager } from "@/hooks/useHealthGoalsManager";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { translateGoalText } from "@/utils/goalTranslations";

interface HealthGoalsSectionProps {
  healthProfile: HealthProfileData;
  isEditMode: boolean;
  onUpdate: (updates: Partial<HealthProfileData>) => void;
}

interface NewGoal {
  title: string;
  description: string;
  category: string;
  priority: string;
  endDate?: Date;
}

const HealthGoalsSection: React.FC<HealthGoalsSectionProps> = ({
  healthProfile,
  isEditMode,
  onUpdate
}) => {
  const [showCustomGoalModal, setShowCustomGoalModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState<NewGoal>({
    title: '',
    description: '',
    category: 'fitness',
    priority: 'medium'
  });
  const { createCustomGoal } = useHealthGoalsManager();

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

  const handleAddCustomGoal = async (goalData: any) => {
    const success = await createCustomGoal(goalData);
    if (success) {
      // Обновляем локальное состояние если нужно
      console.log('Custom goal created successfully');
    }
    // Не возвращаем boolean, функция должна быть void
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {translateGoalText("Health Goals")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Выберите цели, которые хотите достичь</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {predefinedGoals.map((goal) => (
              <div key={goal.key} className="flex items-center space-x-2">
                <Checkbox
                  id={goal.key}
                  checked={(healthProfile.healthGoals || []).includes(goal.key)}
                  onCheckedChange={(checked) => handleGoalChange(goal.key, !!checked)}
                />
                <Label htmlFor={goal.key}>{goal.label}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Кнопка добавления пользовательской цели */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomGoalModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить свою цель
          </Button>
        </div>

        {/* Модальное окно для создания пользовательской цели */}
        <AddCustomGoalModal
          isOpen={showCustomGoalModal}
          onClose={() => setShowCustomGoalModal(false)}
          onSave={handleAddCustomGoal}
        />
      </CardContent>
    </Card>
  );
};

export default HealthGoalsSection;
