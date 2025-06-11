
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import AnalysisCardHeader from "./AnalysisCardHeader";
import AnalysisCardStats from "./AnalysisCardStats";
import AnalysisCardActions from "./AnalysisCardActions";
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
          <AnalysisCardHeader
            analysis={analysis}
            riskLevel={riskLevel}
            getAnalysisTypeLabel={getAnalysisTypeLabel}
            getRiskIcon={getRiskIcon}
            getRiskColor={getRiskColor}
            getRiskText={getRiskText}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <AnalysisCardStats
            statusCounts={statusCounts}
            healthScore={analysis.results?.healthScore}
          />

          <AnalysisCardActions
            hasMarkers={statusCounts.total > 0}
            onViewAnalysis={() => onViewAnalysis(analysis.id)}
            onEdit={handleEdit}
          />
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
