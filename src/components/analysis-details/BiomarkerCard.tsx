
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, TrendingUp, Activity } from 'lucide-react';
import BiomarkerTrendChart from './BiomarkerTrendChart';
import BiomarkerStatus from './BiomarkerStatus';

interface BiomarkerCardProps {
  name: string;
  value: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  recommendation?: string;
  detailedRecommendation?: string;
}

const BiomarkerCard: React.FC<BiomarkerCardProps> = ({
  name,
  value,
  normalRange,
  status,
  recommendation,
  detailedRecommendation
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTrend, setShowTrend] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{name}</CardTitle>
          <BiomarkerStatus status={status} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Значение:</span>
            <span className="font-semibold">{value}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Норма:</span>
            <span className="text-gray-500">{normalRange}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Базовая рекомендация */}
        {recommendation && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{recommendation}</p>
          </div>
        )}

        {/* Кнопки для раскрытия дополнительной информации */}
        <div className="flex gap-2">
          {detailedRecommendation && (
            <Collapsible open={showDetails} onOpenChange={setShowDetails}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  {showDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <TrendingUp className="h-4 w-4" />
                  Подробные рекомендации
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Детальные рекомендации:</h4>
                  <p className="text-sm text-green-800 whitespace-pre-line">{detailedRecommendation}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Collapsible open={showTrend} onOpenChange={setShowTrend}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                {showTrend ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Activity className="h-4 w-4" />
                Динамика
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3">
              <BiomarkerTrendChart biomarkerName={name} />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkerCard;
