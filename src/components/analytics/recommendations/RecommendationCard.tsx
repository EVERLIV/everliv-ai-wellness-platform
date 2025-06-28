import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Save, Heart, Dumbbell, Moon, Brain, Apple, TestTube } from 'lucide-react';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';
import RecommendationDetails from './RecommendationDetails';
import { supabase } from '@/integrations/supabase/client';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { user } = useSmartAuth();
  const isMobile = useIsMobile();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return <Apple className="h-4 w-4" />;
      case 'exercise':
        return <Dumbbell className="h-4 w-4" />;
      case 'sleep':
        return <Moon className="h-4 w-4" />;
      case 'stress':
        return <Brain className="h-4 w-4" />;
      case 'supplements':
        return <Heart className="h-4 w-4" />;
      case 'biohacking':
        return <TestTube className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exercise':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sleep':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'stress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'supplements':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'biohacking':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'nutrition':
        return 'Питание';
      case 'exercise':
        return 'Тренировки';
      case 'sleep':
        return 'Сон';
      case 'stress':
        return 'Стресс';
      case 'supplements':
        return 'Добавки';
      case 'biohacking':
        return 'Биохакинг';
      default:
        return 'Общее';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'Критично';
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return 'Неизвестно';
    }
  };

  const handleSaveRecommendation = async () => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему для сохранения рекомендаций",
        variant: "destructive",
      });
      return;
    }

    try {
      // Подготавливаем данные в правильном формате для таблицы personal_recommendations
      const sourceData = {
        implementation: recommendation.implementation || {},
        scientificBasis: recommendation.scientificBasis || '',
        biohackingLevel: recommendation.biohackingLevel || 'beginner',
        safetyWarnings: recommendation.safetyWarnings || [],
        contraindications: recommendation.contraindications || [],
        evidenceLevel: recommendation.evidenceLevel || 'moderate'
      };

      console.log('Saving recommendation with data:', {
        user_id: user.id,
        title: recommendation.title,
        description: recommendation.description,
        category: recommendation.category,
        priority: recommendation.priority,
        source_data: sourceData
      });

      const { data, error } = await supabase
        .from('personal_recommendations')
        .insert({
          user_id: user.id,
          title: recommendation.title,
          description: recommendation.description,
          category: recommendation.category,
          priority: recommendation.priority,
          source_data: sourceData
        })
        .select();

      if (error) {
        console.error('Supabase error saving recommendation:', error);
        toast({
          title: "Ошибка",
          description: `Не удалось сохранить рекомендацию: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Recommendation saved successfully:', data);
      
      toast({
        title: "Рекомендация сохранена",
        description: "Рекомендация добавлена в ваши персональные рекомендации. Перейдите в раздел 'Мои рекомендации' для отслеживания прогресса.",
      });
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast({
        title: "Ошибка",
        description: "Произошла неожиданная ошибка. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
      <CardHeader className={`${isMobile ? 'pb-3 px-4' : 'pb-4'}`}>
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-start justify-between'}`}>
          <div className="flex-1">
            <div className={`flex items-center gap-2 mb-2 ${isMobile ? 'flex-wrap' : ''}`}>
              {getCategoryIcon(recommendation.category)}
              <Badge className={`${getCategoryColor(recommendation.category)} border text-xs`}>
                {getCategoryName(recommendation.category)}
              </Badge>
              <Badge className={`${getPriorityColor(recommendation.priority)} border text-xs`}>
                {getPriorityText(recommendation.priority)}
              </Badge>
            </div>
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} leading-tight mb-2`}>
              {recommendation.title}
            </CardTitle>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-sm'} leading-relaxed`}>
              {recommendation.description}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-between' : 'ml-4'}`}>
            <Button
              onClick={handleSaveRecommendation}
              size={isMobile ? "sm" : "sm"}
              variant="outline"
              className={`flex items-center gap-2 ${isMobile ? 'flex-1' : ''}`}
            >
              <Save className="h-4 w-4" />
              {isMobile ? 'Сохранить' : 'Сохранить'}
            </Button>
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "sm"}
              onClick={onToggleExpanded}
              className={`flex items-center gap-1 ${isMobile ? 'flex-1' : ''}`}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {isMobile ? 'Скрыть' : 'Свернуть'}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {isMobile ? 'Детали' : 'Подробнее'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className={`pt-0 ${isMobile ? 'px-4' : ''}`}>
          <RecommendationDetails recommendation={recommendation} />
        </CardContent>
      )}
    </Card>
  );
};

export default RecommendationCard;
