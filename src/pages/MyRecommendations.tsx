import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { useToast } from '@/hooks/use-toast';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart, 
  Dumbbell, 
  Moon, 
  Brain, 
  Apple, 
  TestTube,
  Trash2,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SavedRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  source_data: any;
  created_at: string;
  status: string;
  type: string;
}

const MyRecommendations = () => {
  const [recommendations, setRecommendations] = useState<SavedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSmartAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('Fetching recommendations for user:', user.id);
      
      const { data, error } = await supabase
        .from('health_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }
      
      console.log('Fetched recommendations:', data);
      setRecommendations(data || []);
    } catch (error: any) {
      console.error('Ошибка при загрузке рекомендаций:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить ваши рекомендации',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const markAsCompleted = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_recommendations')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id 
            ? { ...rec, status: 'completed' }
            : rec
        )
      );

      toast({
        title: "Рекомендация выполнена",
        description: "Рекомендация отмечена как выполненная",
      });
    } catch (error) {
      console.error('Error marking recommendation as completed:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отметить рекомендацию как выполненную",
        variant: "destructive",
      });
    }
  };

  const deleteRecommendation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_recommendations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecommendations(prev => prev.filter(rec => rec.id !== id));

      toast({
        title: "Рекомендация удалена",
        description: "Рекомендация успешно удалена",
      });
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить рекомендацию",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <PageLayoutWithHeader
        headerComponent={
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Назад
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Мои рекомендации</h1>
              </div>
            </div>
          </div>
        }
        fullWidth
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-500">Загрузка рекомендаций...</p>
          </div>
        </div>
      </PageLayoutWithHeader>
    );
  }

  return (
    <PageLayoutWithHeader
      headerComponent={
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/analytics")}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад к аналитике
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Мои рекомендации</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Персональные рекомендации, сохраненные из аналитики здоровья
            </p>
          </div>
        </div>
      }
      fullWidth
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-500">Загрузка рекомендаций...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Нет сохраненных рекомендаций
              </h3>
              <p className="text-gray-600 mb-4">
                Сохраните рекомендации из аналитики здоровья, чтобы отслеживать их выполнение
              </p>
              <Button onClick={() => navigate('/analytics')}>
                Перейти к аналитике
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {getCategoryIcon(recommendation.category)}
                        <Badge className={`${getCategoryColor(recommendation.category)} border text-xs`}>
                          {getCategoryName(recommendation.category)}
                        </Badge>
                        <Badge className={`${getPriorityColor(recommendation.priority)} border text-xs`}>
                          {getPriorityText(recommendation.priority)}
                        </Badge>
                        {recommendation.status === 'completed' ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Выполнено
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Активно
                          </Badge>
                        )}
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          ИИ-рекомендация
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight mb-2">
                        {recommendation.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Сохранено: {new Date(recommendation.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {recommendation.status !== 'completed' && (
                        <Button
                          onClick={() => markAsCompleted(recommendation.id)}
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Выполнено
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteRecommendation(recommendation.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayoutWithHeader>
  );
};

export default MyRecommendations;
