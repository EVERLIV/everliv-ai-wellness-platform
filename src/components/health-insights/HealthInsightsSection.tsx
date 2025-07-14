import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthInsight, getCategoryTitle, getCategoryDescription, InsightCategory } from '@/types/healthInsights';
import { TrendingUp, Target, User, ChevronDown, ChevronUp } from 'lucide-react';
import HealthInsightCard from './HealthInsightCard';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface HealthInsightsSectionProps {
  category: InsightCategory;
  insights: HealthInsight[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const HealthInsightsSection: React.FC<HealthInsightsSectionProps> = ({
  category,
  insights,
  isExpanded = false,
  onToggleExpand
}) => {
  const [isOpen, setIsOpen] = useState(isExpanded);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const handleSectionToggle = () => {
    setIsOpen(!isOpen);
    onToggleExpand?.();
  };

  const handleCardToggle = (insightId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId);
    } else {
      newExpanded.add(insightId);
    }
    setExpandedCards(newExpanded);
  };

  const getCategoryIcon = (category: InsightCategory) => {
    const iconMap = {
      predictive: TrendingUp,
      practical: Target,
      personalized: User
    };
    const IconComponent = iconMap[category];
    return <IconComponent className="h-5 w-5" />;
  };

  const getCategoryColor = (category: InsightCategory) => {
    const colorMap = {
      predictive: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100',
      practical: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100',
      personalized: 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100'
    };
    return colorMap[category];
  };

  const getPriorityStats = () => {
    const high = insights.filter(i => i.priority === 'high').length;
    const medium = insights.filter(i => i.priority === 'medium').length;
    const low = insights.filter(i => i.priority === 'low').length;
    return { high, medium, low };
  };

  const stats = getPriorityStats();

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className={`${getCategoryColor(category)} border-2 shadow-sm hover:shadow-md transition-all duration-200`}>
      <CardHeader className="pb-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <div 
              className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleSectionToggle}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${category === 'predictive' ? 'bg-blue-200 text-blue-700' : category === 'practical' ? 'bg-green-200 text-green-700' : 'bg-purple-200 text-purple-700'}`}>
                  {getCategoryIcon(category)}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {getCategoryTitle(category)}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {getCategoryDescription(category)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {insights.length} {insights.length === 1 ? 'инсайт' : 'инсайтов'}
                  </Badge>
                  {stats.high > 0 && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      {stats.high} приоритетных
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CollapsibleTrigger>
        </Collapsible>
      </CardHeader>

      <CardContent className="pt-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="space-y-4 animate-accordion-down">
            {/* Статистика приоритетов */}
            <div className="flex gap-2 flex-wrap mb-4">
              {stats.high > 0 && (
                <div className="flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {stats.high} высокий приоритет
                </div>
              )}
              {stats.medium > 0 && (
                <div className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  {stats.medium} средний приоритет
                </div>
              )}
              {stats.low > 0 && (
                <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {stats.low} низкий приоритет
                </div>
              )}
            </div>

            {/* Список инсайтов */}
            <div className="space-y-4">
              {insights
                .sort((a, b) => {
                  // Сортировка по приоритету: high -> medium -> low
                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map((insight) => (
                  <HealthInsightCard
                    key={insight.id}
                    insight={insight}
                    isExpanded={expandedCards.has(insight.id)}
                    onToggleExpand={() => handleCardToggle(insight.id)}
                  />
                ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default HealthInsightsSection;