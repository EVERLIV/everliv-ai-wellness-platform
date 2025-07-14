import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HealthInsight, getPriorityColor, getPriorityLabel } from '@/types/healthInsights';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, TrendingUp, Clock, Lightbulb } from 'lucide-react';

interface HealthInsightCardProps {
  insight: HealthInsight;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const HealthInsightCard: React.FC<HealthInsightCardProps> = ({
  insight,
  isExpanded = false,
  onToggleExpand
}) => {
  const [isOpen, setIsOpen] = useState(isExpanded);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggleExpand?.();
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {insight.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className={`${getPriorityColor(insight.priority)} flex items-center gap-1`}
              >
                {getPriorityIcon(insight.priority)}
                {getPriorityLabel(insight.priority)}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Достоверность: <span className={getConfidenceColor(insight.confidence)}>{insight.confidence}%</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {insight.timeframe}
              </Badge>
            </div>
          </div>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleToggle}
                className="ml-2"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-700 mb-4 leading-relaxed">
          {insight.description}
        </p>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="space-y-4 animate-accordion-down">
            {/* Научное обоснование */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Научное обоснование
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {insight.scientificBasis}
              </p>
            </div>

            {/* План действий */}
            {insight.actionItems && insight.actionItems.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  План действий
                </h4>
                <ul className="space-y-2">
                  {insight.actionItems.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-green-800 text-sm">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Факторы риска */}
            {insight.riskFactors && insight.riskFactors.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Факторы риска
                </h4>
                <ul className="space-y-1">
                  {insight.riskFactors.map((risk, index) => (
                    <li key={index} className="text-red-800 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Преимущества */}
            {insight.benefits && insight.benefits.length > 0 && (
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Ожидаемые преимущества
                </h4>
                <ul className="space-y-1">
                  {insight.benefits.map((benefit, index) => (
                    <li key={index} className="text-emerald-800 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default HealthInsightCard;