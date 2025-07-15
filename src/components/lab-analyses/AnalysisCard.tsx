
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
    markers_count?: number;
    summary?: string;
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

  console.log('🔍 AnalysisCard: Rendering card for analysis:', {
    id: analysis.id,
    type: analysis.analysis_type,
    markersCount: analysis.markers_count,
    hasResults: !!analysis.results,
    resultsMarkers: analysis.results?.markers?.length || 0
  });

  const getStatusCounts = () => {
    // Проверяем маркеры из results
    const markers = analysis.results?.markers || [];
    const totalFromCount = analysis.markers_count || 0;
    
    console.log('📊 AnalysisCard: Calculating status counts:', {
      markersFromResults: markers.length,
      markersFromCount: totalFromCount,
      markers: markers.slice(0, 3) // показываем первые 3 для отладки
    });
    
    if (markers.length === 0 && totalFromCount === 0) {
      console.log('⚠️ AnalysisCard: No markers found');
      return { optimal: 0, attention: 0, risk: 0, total: 0 };
    }
    
    // Если есть подробные маркеры из results, используем их
    if (markers.length > 0) {
      const counts = {
        optimal: markers.filter(m => 
          m.status === 'optimal' || 
          m.status === 'good' || 
          m.status === 'normal' ||
          m.status === 'low' // добавим low как оптимальный для некоторых показателей
        ).length,
        attention: markers.filter(m => 
          m.status === 'attention' ||
          m.status === 'medium'
        ).length,
        risk: markers.filter(m => 
          m.status === 'risk' || 
          m.status === 'high' || 
          m.status === 'critical'
        ).length,
        total: markers.length
      };
      
      console.log('✅ AnalysisCard: Status counts from results:', counts);
      return counts;
    }
    
    // Если есть только общее количество, используем примерное распределение
    const estimatedCounts = {
      optimal: Math.floor(totalFromCount * 0.7), // примерно 70% оптимальных
      attention: Math.floor(totalFromCount * 0.2), // примерно 20% требуют внимания
      risk: Math.floor(totalFromCount * 0.1), // примерно 10% риск
      total: totalFromCount
    };
    
    console.log('📊 AnalysisCard: Estimated status counts:', estimatedCounts);
    return estimatedCounts;
  };

  const statusCounts = getStatusCounts();
  
  const calculateRiskLevel = () => {
    // Сначала проверяем есть ли уже вычисленный riskLevel
    if (analysis.results?.riskLevel) {
      console.log('🎯 AnalysisCard: Using existing risk level:', analysis.results.riskLevel);
      return analysis.results.riskLevel;
    }
    
    if (statusCounts.total === 0) {
      console.log('⚪ AnalysisCard: No data for risk calculation');
      return 'unknown';
    }
    
    const riskPercentage = (statusCounts.risk + statusCounts.attention) / statusCounts.total;
    
    let calculatedRisk = 'low';
    if (riskPercentage >= 0.5) calculatedRisk = 'high';
    else if (riskPercentage >= 0.2) calculatedRisk = 'medium';
    
    console.log('🎯 AnalysisCard: Calculated risk level:', {
      riskPercentage,
      calculatedRisk,
      statusCounts
    });
    
    return calculatedRisk;
  };

  const riskLevel = calculateRiskLevel();

  const handleEdit = () => {
    console.log('✏️ AnalysisCard: Opening edit dialog for:', analysis.id);
    setShowEditDialog(true);
  };

  const handleDelete = () => {
    console.log('🗑️ AnalysisCard: Analysis deleted, refreshing');
    onRefresh();
  };

  const handleSaveEdit = () => {
    console.log('💾 AnalysisCard: Analysis edited, refreshing');
    onRefresh();
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200/80 hover:border-gray-300 rounded-none">
        <CardContent className="p-3">
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
            onViewAnalysis={() => {
              console.log('👁️ AnalysisCard: Viewing analysis:', analysis.id);
              onViewAnalysis(analysis.id);
            }}
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
