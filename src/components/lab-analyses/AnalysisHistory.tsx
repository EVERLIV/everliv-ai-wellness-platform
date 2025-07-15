import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AnalysisCard from "./AnalysisCard";
import EmptyAnalysisState from "./EmptyAnalysisState";
import { AnalysisItem } from "@/types/labAnalyses";

interface AnalysisHistoryProps {
  analysisHistory: AnalysisItem[];
  loadingHistory: boolean;
  onViewAnalysis: (analysisId: string) => void;
  onAddNewAnalysis: () => void;
  onRefresh?: () => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  analysisHistory,
  loadingHistory,
  onViewAnalysis,
  onAddNewAnalysis,
  onRefresh = () => {},
}) => {
  console.log('🔍 AnalysisHistory: Rendering with data:', {
    historyLength: analysisHistory?.length || 0,
    isLoading: loadingHistory,
    firstAnalysis: analysisHistory?.[0],
    allAnalyses: analysisHistory
  });

  const getAnalysisTypeLabel = (type: string) => {
    const types = {
      blood: "Общий анализ крови",
      urine: "Общий анализ мочи", 
      biochemistry: "Биохимический анализ крови",
      hormones: "Гормональная панель",
      vitamins: "Витамины и микроэлементы",
      immunology: "Иммунологические исследования",
      oncology: "Онкомаркеры",
      cardiology: "Кардиологические маркеры",
      lipids: "Липидограмма",
      diabetes: "Анализы на диабет",
      thyroid: "Функция щитовидной железы",
      other: "Другие анализы"
    };
    return types[type] || type;
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return "🔴";
      case 'medium':
        return "🟡";
      case 'low':
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getRiskColor = (level: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (level) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'high':
        return 'Высокий риск';
      case 'medium':
        return 'Средний риск';
      case 'low':
        return 'Низкий риск';
      default:
        return 'Не определен';
    }
  };

  if (loadingHistory) {
    console.log('⏳ AnalysisHistory: Showing loading state');
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">История анализов</h2>
          <div className="animate-pulse h-3 bg-gray-200 rounded w-20"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse rounded-none border-gray-200/80">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-none"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="h-8 bg-gray-200 rounded-none"></div>
                    <div className="h-8 bg-gray-200 rounded-none"></div>
                    <div className="h-8 bg-gray-200 rounded-none"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-none"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analysisHistory || analysisHistory.length === 0) {
    console.log('📭 AnalysisHistory: Showing empty state');
    return <EmptyAnalysisState onAddAnalysis={onAddNewAnalysis} />;
  }

  console.log('✅ AnalysisHistory: Rendering analyses grid with', analysisHistory.length, 'items');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">История анализов</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-none">
          {analysisHistory.length} {analysisHistory.length === 1 ? 'анализ' : 'анализов'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {analysisHistory.map((analysis, index) => {
          console.log(`🔍 AnalysisHistory: Rendering analysis ${index + 1}:`, {
            id: analysis.id,
            type: analysis.analysis_type,
            markersCount: analysis.markers_count,
            hasResults: !!analysis.results
          });
          
          return (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              onViewAnalysis={onViewAnalysis}
              onRefresh={onRefresh}
              getAnalysisTypeLabel={getAnalysisTypeLabel}
              getRiskIcon={getRiskIcon}
              getRiskColor={getRiskColor}
              getRiskText={getRiskText}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisHistory;
