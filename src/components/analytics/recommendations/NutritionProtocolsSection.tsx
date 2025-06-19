
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Utensils, Clock, CheckCircle, X } from 'lucide-react';
import { NutritionProtocol } from '@/utils/comprehensiveHealthAnalyzer';

interface NutritionProtocolsSectionProps {
  protocols: NutritionProtocol[];
}

const NutritionProtocolsSection: React.FC<NutritionProtocolsSectionProps> = ({ protocols }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Utensils className="h-5 w-5" />
          Протоколы питания
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {protocols.map((protocol) => (
            <div key={protocol.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{protocol.name}</h4>
                  <p className="text-sm text-gray-600">{protocol.description}</p>
                </div>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(protocol.id)}
                    >
                      {expandedItems[protocol.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {/* Контент будет отображаться ниже */}
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg mb-4">
                <h5 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Протокол:
                </h5>
                <p className="text-sm text-orange-700">{protocol.protocol}</p>
              </div>

              {expandedItems[protocol.id] && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Польза:</h5>
                    <ul className="space-y-1">
                      {protocol.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Рекомендуемые продукты:</h5>
                      <ul className="space-y-1">
                        {protocol.foods.recommended.map((food, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-50 p-3 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">Избегать:</h5>
                      <ul className="space-y-1">
                        {protocol.foods.avoid.map((food, index) => (
                          <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                            <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Время приема пищи:</h5>
                    <p className="text-sm text-blue-700">{protocol.foods.timing}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Рекомендуемые добавки:</h5>
                    <ul className="space-y-1">
                      {protocol.supplementation.map((supplement, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {supplement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Контроль прогресса:</h5>
                    <ul className="space-y-1">
                      {protocol.monitoring.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionProtocolsSection;
