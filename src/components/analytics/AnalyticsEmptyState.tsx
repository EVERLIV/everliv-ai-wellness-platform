
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, RefreshCw } from "lucide-react";

interface AnalyticsEmptyStateProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({
  onGenerate,
  isGenerating
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Аналитика не сгенерирована
            </h2>
            <p className="text-gray-500 mb-6">
              Нажмите кнопку ниже, чтобы создать персональную аналитику здоровья на основе ваших данных
            </p>
            <Button onClick={onGenerate} disabled={isGenerating} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Генерирую аналитику...' : 'Сгенерировать аналитику'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsEmptyState;
