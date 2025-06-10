
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface LifestyleRecommendation {
  advice: string;
  benefit: string;
  howTo: string;
}

interface LifestyleCategory {
  id: string;
  category: string;
  recommendations: LifestyleRecommendation[];
}

interface LifestyleRecommendationsProps {
  recommendations: LifestyleCategory[];
}

const LifestyleRecommendations: React.FC<LifestyleRecommendationsProps> = ({ recommendations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-500" />
          Рекомендации по образу жизни
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((category) => (
            <div key={category.id}>
              <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
              <div className="space-y-3">
                {category.recommendations.map((rec, index) => (
                  <div key={index} className="border border-orange-200 bg-orange-50 p-3 rounded">
                    <h5 className="font-medium text-orange-900 text-sm">{rec.advice}</h5>
                    <p className="text-xs text-orange-700 mt-1">{rec.benefit}</p>
                    <p className="text-xs text-gray-600 mt-2">
                      <strong>Как:</strong> {rec.howTo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LifestyleRecommendations;
