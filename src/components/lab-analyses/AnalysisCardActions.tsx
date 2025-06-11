
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Activity } from "lucide-react";

interface AnalysisCardActionsProps {
  hasMarkers: boolean;
  onViewAnalysis: () => void;
  onEdit: () => void;
}

const AnalysisCardActions: React.FC<AnalysisCardActionsProps> = ({
  hasMarkers,
  onViewAnalysis,
  onEdit,
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 gap-2"
        onClick={onViewAnalysis}
      >
        <Eye className="h-4 w-4" />
        <span className="hidden sm:inline">Подробно</span>
        <span className="sm:hidden">Детали</span>
      </Button>
      
      {hasMarkers && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="gap-2"
          onClick={onEdit}
        >
          <Activity className="h-4 w-4" />
          <span className="hidden md:inline">Редактировать</span>
        </Button>
      )}
    </div>
  );
};

export default AnalysisCardActions;
