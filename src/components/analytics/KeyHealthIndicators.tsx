
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface HealthIndicator {
  name: string;
  target: string;
  importance: string;
  frequency: string;
}

interface KeyHealthIndicatorCategory {
  id: string;
  category: string;
  indicators: HealthIndicator[];
}

interface KeyHealthIndicatorsProps {
  indicators: KeyHealthIndicatorCategory[];
}

const KeyHealthIndicators: React.FC<KeyHealthIndicatorsProps> = ({ indicators }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Ключевые показатели для мониторинга
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {indicators.map((category) => (
            <div key={category.id}>
              <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.indicators.map((indicator, index) => (
                  <div key={index} className="border border-gray-200 bg-gray-50 p-3 rounded">
                    <h5 className="font-medium text-gray-900 text-sm">{indicator.name}</h5>
                    <p className="text-sm text-blue-600 font-semibold">{indicator.target}</p>
                    <p className="text-xs text-gray-600 mt-1">{indicator.importance}</p>
                    <p className="text-xs text-gray-500">Контроль: {indicator.frequency}</p>
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

export default KeyHealthIndicators;
