
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertTriangle } from "lucide-react";

interface PriorityRecommendation {
  title: string;
  description: string;
  expectedResult: string;
}

interface PriorityRecommendationsProps {
  recommendations: PriorityRecommendation[];
}

const PriorityRecommendations: React.FC<PriorityRecommendationsProps> = ({ recommendations }) => {
  if (recommendations.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-red-600" />
        <h2 className="text-xl font-semibold text-gray-900">Приоритетные действия</h2>
        <Badge className="bg-red-100 text-red-800">Срочно</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <Card key={index} className="border-2 border-red-200 bg-red-50 hover:border-red-300 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <CardTitle className="text-sm font-medium">{rec.title}</CardTitle>
                </div>
                <Badge className="bg-red-100 text-red-800 text-xs">Высокий</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
              <div className="text-xs text-gray-600">
                <strong>Ожидаемый результат:</strong> {rec.expectedResult}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PriorityRecommendations;
