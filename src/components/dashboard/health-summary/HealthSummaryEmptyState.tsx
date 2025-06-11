
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

interface HealthSummaryEmptyStateProps {
  hasHealthProfile: boolean;
  hasAnalyses: boolean;
  onGenerate: () => void;
  isGenerating: boolean;
}

const HealthSummaryEmptyState: React.FC<HealthSummaryEmptyStateProps> = ({
  hasHealthProfile,
  hasAnalyses,
  onGenerate,
  isGenerating
}) => {
  return (
    <CardContent>
      <div className="text-center py-6">
        <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {(!hasHealthProfile || !hasAnalyses) ? 'Данных нет' : 'Аналитика не сгенерирована'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {(!hasHealthProfile || !hasAnalyses) 
            ? 'Для получения сводки здоровья необходимо заполнить профиль и добавить анализы'
            : 'Для получения персональной сводки здоровья нажмите "Обновить"'
          }
        </p>
        {(hasHealthProfile && hasAnalyses) && (
          <Button onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? 'Генерация...' : 'Сгенерировать аналитику'}
          </Button>
        )}
      </div>
    </CardContent>
  );
};

export default HealthSummaryEmptyState;
