
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Activity } from "lucide-react";

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

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getRiskIcon(riskLevel)}</div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {getAnalysisTypeLabel(analysis.analysis_type)}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar className="h-4 w-4" />
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
          <Badge variant={getRiskColor(riskLevel)} className="text-xs">
            {getRiskText(riskLevel)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Краткая статистика */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-green-600 font-medium">✓ {statusCounts.optimal}</span>
            <span className="text-yellow-600 font-medium">⚠ {statusCounts.attention}</span>
            <span className="text-red-600 font-medium">⚡ {statusCounts.risk}</span>
          </div>
          <span className="text-gray-500">
            Всего: {statusCounts.total}
          </span>
        </div>

        {/* Индекс здоровья если есть */}
        {analysis.results?.healthScore && (
          <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
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

        {/* Кнопка просмотра */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2"
          onClick={() => onViewAnalysis(analysis.id)}
        >
          <Eye className="h-4 w-4" />
          Подробно
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
