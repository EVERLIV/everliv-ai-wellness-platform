
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onCancel: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onCancel
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Отмена</span>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Профиль здоровья
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Заполните информацию для персональных рекомендаций
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Шаг {currentStep + 1} из {totalSteps}</span>
            <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
