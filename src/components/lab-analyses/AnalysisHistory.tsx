
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AnalysisCard from "./AnalysisCard";
import EmptyAnalysisState from "./EmptyAnalysisState";

interface AnalysisHistoryProps {
  analysisHistory: any[];
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
    firstAnalysis: analysisHistory?.[0]
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
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">История анализов</h2>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">История анализов</h2>
        <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-2 md:px-3 py-1 rounded-full">
          {analysisHistory.length} {analysisHistory.length === 1 ? 'анализ' : 'анализов'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
