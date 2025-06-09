
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AnalysisCard from "./AnalysisCard";
import EmptyAnalysisState from "./EmptyAnalysisState";

interface AnalysisHistoryProps {
  analysisHistory: any[];
  loadingHistory: boolean;
  onViewAnalysis: (analysisId: string) => void;
  onAddNewAnalysis: () => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  analysisHistory,
  loadingHistory,
  onViewAnalysis,
  onAddNewAnalysis,
}) => {
  const getAnalysisTypeLabel = (type: string) => {
    const types = {
      blood: "Анализ крови",
      urine: "Анализ мочи", 
      biochemistry: "Биохимический анализ",
      hormones: "Гормональная панель",
      vitamins: "Витамины и микроэлементы",
      immunology: "Иммунологические исследования",
      oncology: "Онкомаркеры",
      cardiology: "Кардиологические маркеры",
      other: "Другой анализ"
    };
    return types[type] || type;
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return "🔴";
      case 'medium':
        return "🟡";
      default:
        return "🟢";
    }
  };

  const getRiskColor = (level: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (level) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'high':
        return 'Высокий риск';
      case 'medium':
        return 'Средний риск';
      default:
        return 'Низкий риск';
    }
  };

  if (loadingHistory) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (analysisHistory.length === 0) {
    return <EmptyAnalysisState onAddAnalysis={onAddNewAnalysis} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {analysisHistory.map((analysis) => (
        <AnalysisCard
          key={analysis.id}
          analysis={analysis}
          onViewAnalysis={onViewAnalysis}
          getAnalysisTypeLabel={getAnalysisTypeLabel}
          getRiskIcon={getRiskIcon}
          getRiskColor={getRiskColor}
          getRiskText={getRiskText}
        />
      ))}
    </div>
  );
};

export default AnalysisHistory;
