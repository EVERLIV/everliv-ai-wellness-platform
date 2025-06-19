
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Snowflake, Wind, AlertTriangle, Clock } from 'lucide-react';
import { AdvancedTherapy } from '@/utils/comprehensiveHealthAnalyzer';

interface AdvancedTherapiesSectionProps {
  therapies: AdvancedTherapy[];
}

const AdvancedTherapiesSection: React.FC<AdvancedTherapiesSectionProps> = ({ therapies }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getTherapyIcon = (name: string) => {
    if (name.toLowerCase().includes('холод')) return <Snowflake className="h-5 w-5 text-blue-600" />;
    if (name.toLowerCase().includes('дыхат')) return <Wind className="h-5 w-5 text-green-600" />;
    return <Clock className="h-5 w-5 text-purple-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Snowflake className="h-5 w-5" />
          Продвинутые терапии
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {therapies.map((therapy) => (
            <div key={therapy.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getTherapyIcon(therapy.name)}
                  <div>
                    <h4 className="font-semibold text-gray-900">{therapy.name}</h4>
                    <p className="text-sm text-gray-600">{therapy.description}</p>
                  </div>
                </div>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(therapy.id)}
                    >
                      {expandedItems[therapy.id] ? (
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="font-medium text-blue-800">Протокол</h5>
                  <p className="text-sm text-blue-700">{therapy.protocol}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h5 className="font-medium text-green-800">Длительность</h5>
                  <p className="text-sm text-green-700">{therapy.duration}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h5 className="font-medium text-purple-800">Частота</h5>
                  <p className="text-sm text-purple-700">{therapy.frequency}</p>
                </div>
              </div>

              {expandedItems[therapy.id] && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Польза:</h5>
                    <ul className="space-y-1">
                      {therapy.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">План внедрения:</h5>
                    <ol className="space-y-1">
                      {therapy.implementation.map((step, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 font-medium min-w-[20px]">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Научное обоснование:</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{therapy.scientificEvidence}</p>
                  </div>

                  {therapy.contraindications.length > 0 && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Противопоказания:
                      </h5>
                      <ul className="space-y-1">
                        {therapy.contraindications.map((contraindication, index) => (
                          <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {contraindication}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedTherapiesSection;
