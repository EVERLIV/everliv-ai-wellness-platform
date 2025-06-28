
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertTriangle } from "lucide-react";
import { ComprehensiveRecommendation } from "@/utils/comprehensiveHealthAnalyzer";
import { useIsMobile } from "@/hooks/use-mobile";

interface PriorityRecommendationsProps {
  recommendations: ComprehensiveRecommendation[];
}

const PriorityRecommendations: React.FC<PriorityRecommendationsProps> = ({ recommendations }) => {
  const isMobile = useIsMobile();

  if (recommendations.length === 0) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Критично';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Высокий';
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-red-600" />
        <h2 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>Приоритетные действия</h2>
        <Badge className="bg-red-100 text-red-800">Срочно</Badge>
      </div>
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {recommendations.map((rec, index) => (
          <Card key={rec.id} className="border-2 border-red-200 bg-red-50 hover:border-red-300 transition-colors">
            <CardHeader className={`pb-3 ${isMobile ? 'px-4 py-3' : ''}`}>
              <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-start justify-between'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <CardTitle className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>{rec.title}</CardTitle>
                </div>
                <Badge className={`${getPriorityColor(rec.priority)} border ${isMobile ? 'text-xs self-start' : 'text-xs'}`}>
                  {getPriorityLabel(rec.priority)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className={`pt-0 ${isMobile ? 'px-4 pb-4' : ''}`}>
              <p className={`text-gray-700 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>{rec.description}</p>
              <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                <strong>Ожидаемый результат:</strong> {rec.implementation.expectedResults}
              </div>
              {rec.cost && (
                <div className={`text-gray-600 mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  <strong>Стоимость:</strong> {rec.cost}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PriorityRecommendations;
