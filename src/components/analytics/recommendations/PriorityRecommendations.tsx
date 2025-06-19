
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertTriangle } from "lucide-react";
import { ComprehensiveRecommendation } from "@/utils/comprehensiveHealthAnalyzer";

interface PriorityRecommendationsProps {
  recommendations: ComprehensiveRecommendation[];
}

const PriorityRecommendations: React.FC<PriorityRecommendationsProps> = ({ recommendations }) => {
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
        <h2 className="text-xl font-semibold text-gray-900">Приоритетные действия</h2>
        <Badge className="bg-red-100 text-red-800">Срочно</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <Card key={rec.id} className="border-2 border-red-200 bg-red-50 hover:border-red-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <CardTitle className="text-sm font-medium">{rec.title}</CardTitle>
                </div>
                <Badge className={`text-xs ${getPriorityColor(rec.priority)} border`}>
                  {getPriorityLabel(rec.priority)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
              <div className="text-xs text-gray-600">
                <strong>Ожидаемый результат:</strong> {rec.implementation.expectedResults}
              </div>
              {rec.cost && (
                <div className="text-xs text-gray-600 mt-1">
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
