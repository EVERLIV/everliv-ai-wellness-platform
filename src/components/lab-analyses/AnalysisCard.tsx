
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Activity, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

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
  getAnalysisTypeLabel: (type: string) => string;
  getRiskIcon: (level: string) => string;
  getRiskColor: (level: string) => "default" | "destructive" | "outline" | "secondary";
  getRiskText: (level: string) => string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  analysis,
  onViewAnalysis,
  getAnalysisTypeLabel,
  getRiskIcon,
  getRiskColor,
  getRiskText,
}) => {
  const getStatusCounts = () => {
    if (!analysis.results?.markers) return { optimal: 0, attention: 0, risk: 0, total: 0 };
    
    const markers = analysis.results.markers;
    return {
      optimal: markers.filter(m => m.status === 'optimal' || m.status === 'good').length,
      attention: markers.filter(m => m.status === 'attention').length,
      risk: markers.filter(m => m.status === 'risk').length,
      total: markers.length
    };
  };

  const statusCounts = getStatusCounts();
  const riskLevel = analysis.results?.riskLevel || 'low';
  
  const getRiskLevelColor = () => {
    switch (riskLevel) {
      case 'high':
        return 'border-l-red-500 bg-red-50/50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50/50';
      default:
        return 'border-l-green-500 bg-green-50/50';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${getRiskLevelColor()}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getRiskIcon(riskLevel)}</div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {getAnalysisTypeLabel(analysis.analysis_type)}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(analysis.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={getRiskColor(riskLevel)} className="text-xs font-medium">
            {getRiskText(riskLevel)}
          </Badge>
        </div>
        
        {/* Показатель здоровья */}
        {analysis.results?.healthScore && (
          <div className="flex items-center gap-2 mt-3">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Индекс здоровья:</span>
            <span className={`text-lg font-bold ${
              analysis.results.healthScore >= 80 ? 'text-green-600' :
              analysis.results.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {analysis.results.healthScore}%
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Детальная статистика показателей */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="text-xl font-bold text-green-700">{statusCounts.optimal}</div>
            </div>
            <div className="text-xs text-green-600 font-medium">В норме</div>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div className="text-xl font-bold text-yellow-700">{statusCounts.attention}</div>
            </div>
            <div className="text-xs text-yellow-600 font-medium">Внимание</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <div className="text-xl font-bold text-red-700">{statusCounts.risk}</div>
            </div>
            <div className="text-xs text-red-600 font-medium">Риск</div>
          </div>
        </div>

        {/* Общее количество показателей */}
        <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Всего показателей:</span>
          <span className="text-lg font-bold text-gray-900">{statusCounts.total}</span>
        </div>

        {/* Краткое резюме */}
        {analysis.results?.summary && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 line-clamp-3 leading-relaxed">
              {analysis.results.summary}
            </p>
          </div>
        )}

        {/* Кнопка просмотра */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2 border-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          onClick={() => onViewAnalysis(analysis.id)}
        >
          <Eye className="h-4 w-4" />
          Подробные результаты
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
