
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Activity, 
  Utensils, 
  Moon, 
  Brain, 
  Heart,
  Droplets,
  Zap,
  Shield,
  Bone,
  Scale,
  Users
} from 'lucide-react';
import { HealthRecommendation } from '@/types/healthRecommendations';

interface RecommendationCardProps {
  recommendation: HealthRecommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'steps': return <Activity className="h-4 w-4" />;
      case 'exercise': return <Activity className="h-4 w-4" />;
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'stress': return <Brain className="h-4 w-4" />;
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'longevity': return <Zap className="h-4 w-4" />;
      case 'cardiovascular': return <Heart className="h-4 w-4" />;
      case 'cognitive': return <Brain className="h-4 w-4" />;
      case 'musculoskeletal': return <Bone className="h-4 w-4" />;
      case 'metabolism': return <Scale className="h-4 w-4" />;
      case 'immunity': return <Shield className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Критический';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Средний';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'fitness': return 'Фитнес';
      case 'nutrition': return 'Питание';
      case 'sleep': return 'Сон';
      case 'mental': return 'Ментальное здоровье';
      case 'longevity': return 'Долголетие';
      case 'cardiovascular': return 'Сердечно-сосудистая система';
      case 'cognitive': return 'Когнитивные функции';
      case 'musculoskeletal': return 'Костно-мышечная система';
      case 'metabolism': return 'Метаболизм';
      case 'immunity': return 'Иммунитет';
      default: return category;
    }
  };

  return (
    <Card className="hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              {getTypeIcon(recommendation.type)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {recommendation.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {recommendation.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant={getPriorityColor(recommendation.priority)}>
            {getPriorityLabel(recommendation.priority)}
          </Badge>
          <Badge variant="outline">
            {getCategoryLabel(recommendation.category)}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {recommendation.status === 'active' ? 'Активна' : 'Неактивна'}
          </Badge>
        </div>

        {recommendation.created_at && (
          <div className="text-xs text-gray-500 mt-3">
            Создана: {new Date(recommendation.created_at).toLocaleDateString('ru-RU')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
