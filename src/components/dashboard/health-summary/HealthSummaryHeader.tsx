
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, RefreshCw } from "lucide-react";

interface HealthSummaryHeaderProps {
  onRefresh: () => void;
  isGenerating: boolean;
  hasHealthProfile: boolean;
  hasAnalyses: boolean;
}

const HealthSummaryHeader: React.FC<HealthSummaryHeaderProps> = ({
  onRefresh,
  isGenerating,
  hasHealthProfile,
  hasAnalyses
}) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Сводка здоровья
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isGenerating || !hasHealthProfile || !hasAnalyses}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Обновление...' : 'Обновить'}
        </Button>
      </div>
    </CardHeader>
  );
};

export default HealthSummaryHeader;
