
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";

interface AnalysisCardProps {
  analysis: {
    id: string;
    created_at: string;
    analysis_type: string;
    results?: {
      riskLevel?: string;
      markers?: Array<{ status: string; name: string; value: string }>;
      summary?: string;
    };
  };
  onViewAnalysis: (analysisId: string) => void;
  getAnalysisTypeLabel: (type: string) => string;
  getRiskIcon: (level: string) => string;
  getRiskColor: (level: string) => string;
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
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getRiskIcon(analysis.results?.riskLevel || 'low')}</div>
            <div>
              <CardTitle className="text-lg">
                {getAnalysisTypeLabel(analysis.analysis_type)}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar className="h-4 w-4" />
                {new Date(analysis.created_at).toLocaleDateString('ru-RU')}
              </div>
            </div>
          </div>
          <Badge variant={getRiskColor(analysis.results?.riskLevel || 'low')} className="text-xs">
            {getRiskText(analysis.results?.riskLevel || 'low')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Статистика показателей */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {analysis.results?.markers?.filter(m => m.status === 'normal').length || 0}
              </div>
              <div className="text-xs text-gray-500">Норма</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {analysis.results?.markers?.filter(m => m.status !== 'normal').length || 0}
              </div>
              <div className="text-xs text-gray-500">Отклонения</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">
                {analysis.results?.markers?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Всего</div>
            </div>
          </div>
        </div>

        {/* Краткое резюме */}
        {analysis.results?.summary && (
          <div className="text-sm text-gray-600 mb-4 line-clamp-2">
            {analysis.results.summary}
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
          Посмотреть детали
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
