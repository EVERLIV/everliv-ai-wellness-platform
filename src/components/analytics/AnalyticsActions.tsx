
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AnalyticsActionsProps {
  onRefresh: () => void;
  isGenerating: boolean;
}

const AnalyticsActions: React.FC<AnalyticsActionsProps> = ({
  onRefresh,
  isGenerating
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
        Персональная аналитика здоровья
      </h2>
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isGenerating}
        className="gap-2 w-full sm:w-auto"
        size="sm"
      >
        <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Обновление...' : 'Обновить аналитику'}
      </Button>
    </div>
  );
};

export default AnalyticsActions;
