import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Activity, TrendingUp } from "lucide-react";
import AnalysisActions from "./AnalysisActions";
import EditBiomarkersDialog from "./EditBiomarkersDialog";

interface AnalysisCardProps {
  analysis: {
    id: string;
    created_at: string;
    analysis_type: string;
    results?: {
      riskLevel?: string;
      markers?: Array<{ status: string; name: string; value: string; unit?: string }>;
      summary?: string;
      healthScore?: number;
    };
  };
  onViewAnalysis: (analysisId: string) => void;
  onRefresh: () => void;
  getAnalysisTypeLabel: (type: string) => string;
  getRiskIcon: (level: string) => string;
  getRiskColor: (level: string) => "default" | "destructive" | "outline" | "secondary";
  getRiskText: (level: string) => string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  analysis,
  onViewAnalysis,
  onRefresh,
  getAnalysisTypeLabel,
  getRiskIcon,
  getRiskColor,
  getRiskText,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getStatusCounts = () => {
    if (!analysis.results?.markers) return { optimal: 0, attention: 0, risk: 0, total: 0 };
    
    const markers = analysis.results.markers;
    return {
      optimal: markers.filter(m => m.status === 'optimal' || m.status === 'good' || m.status === 'normal').length,
      attention: markers.filter(m => m.status === 'attention').length,
      risk: markers.filter(m => m.status === 'risk' || m.status === 'high' || m.status === 'low' || m.status === 'critical').length,
      total: markers.length
    };
  };

  const statusCounts = getStatusCounts();
  
  const calculateRiskLevel = () => {
    if (analysis.results?.riskLevel) {
      return analysis.results.riskLevel;
    }
    
    if (statusCounts.total === 0) return 'unknown';
    
    const riskPercentage = (statusCounts.risk + statusCounts.attention) / statusCounts.total;
    
    if (riskPercentage >= 0.5) return 'high';
    if (riskPercentage >= 0.2) return 'medium';
    return 'low';
  };

  const riskLevel = calculateRiskLevel();

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleDelete = () => {
    onRefresh();
  };

  const handleSaveEdit = () => {
    onRefresh();
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300">
        <CardContent className="p-4 md:p-6">
          {/* Header */}
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>

          {/* Stats */}
          {statusCounts.total > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-sm md:text-base font-semibold text-green-700">{statusCounts.optimal}</div>
                <div className="text-xs text-green-600">Норма</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded-lg">
                <div className="text-sm md:text-base font-semibold text-yellow-700">{statusCounts.attention}</div>
                <div className="text-xs text-yellow-600">Внимание</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <div className="text-sm md:text-base font-semibold text-red-700">{statusCounts.risk}</div>
                <div className="text-xs text-red-600">Риск</div>
              </div>
            </div>
          )}

          {/* Health Score */}
          {analysis.results?.healthScore && (
            <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Индекс здоровья</span>
              </div>
              <span className={`text-lg font-bold ${
                analysis.results.healthScore >= 80 ? 'text-green-600' :
                analysis.results.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysis.results.healthScore}%
              </span>
            </div>
          )}

          {/* Empty state */}
          {statusCounts.total === 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-sm text-gray-600">
                Анализ обработан
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 gap-2"
              onClick={() => onViewAnalysis(analysis.id)}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Подробно</span>
              <span className="sm:hidden">Детали</span>
            </Button>
            
            {statusCounts.total > 0 && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2"
                onClick={handleEdit}
              >
                <Activity className="h-4 w-4" />
                <span className="hidden md:inline">Редактировать</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <EditBiomarkersDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        analysis={analysis}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default AnalysisCard;
