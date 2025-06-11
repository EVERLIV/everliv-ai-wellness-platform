
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import AnalysisActions from "./AnalysisActions";

interface AnalysisCardHeaderProps {
  analysis: {
    id: string;
    created_at: string;
    analysis_type: string;
  };
  riskLevel: string;
  getAnalysisTypeLabel: (type: string) => string;
  getRiskIcon: (level: string) => string;
  getRiskColor: (level: string) => "default" | "destructive" | "outline" | "secondary";
  getRiskText: (level: string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

const AnalysisCardHeader: React.FC<AnalysisCardHeaderProps> = ({
  analysis,
  riskLevel,
  getAnalysisTypeLabel,
  getRiskIcon,
  getRiskColor,
  getRiskText,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-xl md:text-2xl">{getRiskIcon(riskLevel)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
            {getAnalysisTypeLabel(analysis.analysis_type)}
          </h3>
          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 mt-1">
            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
            <span>
              {new Date(analysis.created_at).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant={getRiskColor(riskLevel)} className="text-xs px-2 py-1 whitespace-nowrap">
          {getRiskText(riskLevel)}
        </Badge>
        <AnalysisActions
          analysisId={analysis.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default AnalysisCardHeader;
