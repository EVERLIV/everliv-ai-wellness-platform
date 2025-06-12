
import React from "react";
import { CachedAnalytics } from "@/types/analytics";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HealthScoreDisplayProps {
  analytics: CachedAnalytics;
}

const HealthScoreDisplay: React.FC<HealthScoreDisplayProps> = ({ analytics }) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'высокий': return 'text-red-600 bg-red-50 border-red-200';
      case 'средний': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'низкий': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {analytics.totalAnalyses || 0}
          </div>
          <div className="text-sm text-gray-500">Анализов</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {analytics.totalConsultations || 0}
          </div>
          <div className="text-sm text-gray-500">Консультаций</div>
        </div>
      </div>

      {/* Балл здоровья */}
      <div className="mb-4 p-3 rounded-lg border bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-700">Балл здоровья:</span>
            {analytics.scoreExplanation && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{analytics.scoreExplanation}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <span className="text-lg font-bold text-blue-600">
            {analytics.healthScore || 0}/100
          </span>
        </div>
      </div>

      {/* Уровень риска */}
      {analytics.riskLevel && (
        <div className={`mb-4 p-3 rounded-lg border ${getRiskLevelColor(analytics.riskLevel)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Уровень риска:</span>
            <span className="font-medium">{analytics.riskLevel}</span>
          </div>
          {analytics.riskDescription && (
            <div className="text-xs opacity-90">
              {analytics.riskDescription}
            </div>
          )}
          {analytics.lastAnalysisDate && (
            <div className="text-xs mt-2 opacity-75">
              Последний анализ: {new Date(analytics.lastAnalysisDate).toLocaleDateString('ru-RU')}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HealthScoreDisplay;
