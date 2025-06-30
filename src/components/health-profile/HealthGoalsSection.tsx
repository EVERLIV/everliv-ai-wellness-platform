import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import AddCustomGoalModal from "./AddCustomGoalModal";
import { useHealthGoalsManager } from "@/hooks/useHealthGoalsManager";

interface HealthGoalsSectionProps {
  healthProfile: HealthProfileData;
  isEditMode: boolean;
  onUpdate: (updates: Partial<HealthProfileData>) => void;
}

const HealthGoalsSection: React.FC<HealthGoalsSectionProps> = ({
  healthProfile,
  isEditMode,
  onUpdate
}) => {
  const [showCustomGoalModal, setShowCustomGoalModal] = useState(false);
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
    'cognitive',
    'cardiovascular',
    'weight_loss',
    'muscle_gain',
    'energy_boost',
    'sleep_improvement',
    'stress_reduction',
    'immunity_boost',
    'longevity',
    'hormonal_balance',
    'digestive_health',
    'skin_health',
    'biological_age',
    'metabolic_health',
    'bone_health',
    'mental_health',
    'detox',
    'athletic_performance'
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
          Цели здоровья
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Выберите цели, которые хотите достичь</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {predefinedGoals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={(healthProfile.healthGoals || []).includes(goal)}
                  onCheckedChange={(checked) => handleGoalChange(goal, !!checked)}
                />
                <Label htmlFor={goal}>{goal}</Label>
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
