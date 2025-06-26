
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';
import RecommendationDetails from './RecommendationDetails';

interface RecommendationCardProps {
  recommendation: AnalyticsRecommendation;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  isExpanded,
  onToggleExpanded
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-blue-100 text-blue-800';
      case 'sleep': return 'bg-purple-100 text-purple-800';
      case 'stress': return 'bg-amber-100 text-amber-800';
      case 'supplements': return 'bg-teal-100 text-teal-800';
      case 'biohacking': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPriorityColor(recommendation.priority)}>
                {recommendation.priority === 'critical' ? 'Критично' :
                 recommendation.priority === 'high' ? 'Высокий' :
                 recommendation.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
              </Badge>
              <Badge className={getCategoryColor(recommendation.category)}>
                {recommendation.category === 'nutrition' ? 'Питание' :
                 recommendation.category === 'exercise' ? 'Активность' :
                 recommendation.category === 'sleep' ? 'Сон' :
                 recommendation.category === 'stress' ? 'Стресс' :
                 recommendation.category === 'supplements' ? 'Добавки' : 'Биохакинг'}
              </Badge>
              <Badge variant="outline">
                {recommendation.biohackingLevel === 'beginner' ? 'Начальный' :
                 recommendation.biohackingLevel === 'intermediate' ? 'Средний' : 'Продвинутый'}
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold mb-2">
              {recommendation.title}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {recommendation.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="ml-4"
          >
            {isExpanded ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          <RecommendationDetails recommendation={recommendation} />
        </CardContent>
      )}
    </Card>
  );
};

export default RecommendationCard;
