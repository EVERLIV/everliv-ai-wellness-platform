
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  HealthRecommendation, 
  RecommendationCheckup, 
  CreateHealthRecommendationInput,
  CreateCheckupInput 
} from '@/types/healthRecommendations';

export const useHealthRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [checkups, setCheckups] = useState<RecommendationCheckup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecommendations();
      loadCheckups();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      // В реальном приложении здесь был бы запрос к базе данных
      // Пока используем локальное состояние для демонстрации
      const mockRecommendations: HealthRecommendation[] = [
        {
          id: '1',
          user_id: user.id,
          title: 'Увеличить ежедневную активность',
          description: 'Постепенно увеличивайте количество шагов до 10,000 в день',
          type: 'steps',
          category: 'fitness',
          priority: 'high',
          status: 'active',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: user.id,
          title: 'Оптимизировать сон',
          description: 'Спать 7-9 часов в сутки, соблюдать режим сна',
          type: 'sleep',
          category: 'sleep',
          priority: 'medium',
          status: 'active',
          created_at: new Date().toISOString(),
        }
      ];
      
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Ошибка загрузки рекомендаций:', error);
      toast.error('Ошибка загрузки рекомендаций');
    }
  };

  const loadCheckups = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const mockCheckups: RecommendationCheckup[] = [
        {
          id: '1',
          recommendation_id: '1',
          user_id: user.id,
          title: 'Проверка активности за неделю',
          description: 'Оценить достижение цели по шагам',
          scheduled_date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // завтра
          status: 'pending',
        },
        {
          id: '2',
          recommendation_id: '2',
          user_id: user.id,
          title: 'Анализ качества сна',
          description: 'Проверить улучшения в режиме сна',
          scheduled_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // вчера (просрочен)
          status: 'pending',
        },
        {
          id: '3',
          recommendation_id: '1',
          user_id: user.id,
          title: 'Еженедельный чекап активности',
          description: 'Проверка прогресса по физической активности',
          scheduled_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          rating: 8,
          result: 'Отличный прогресс! Удалось достичь цели по шагам 5 дней из 7.',
          completed_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
      
      setCheckups(mockCheckups);
    } catch (error) {
      console.error('Ошибка загрузки чекапов:', error);
      toast.error('Ошибка загрузки чекапов');
    } finally {
      setIsLoading(false);
    }
  };

  const createRecommendation = async (data: CreateHealthRecommendationInput) => {
    if (!user) return false;

    try {
      const newRecommendation: HealthRecommendation = {
        id: Date.now().toString(),
        user_id: user.id,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setRecommendations(prev => [...prev, newRecommendation]);
      
      // Автоматически создаем чекап через неделю
      const checkup: RecommendationCheckup = {
        id: (Date.now() + 1).toString(),
        recommendation_id: newRecommendation.id!,
        user_id: user.id,
        title: `Проверка: ${data.title}`,
        description: `Оценка прогресса по рекомендации "${data.title}"`,
        scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      
      setCheckups(prev => [...prev, checkup]);
      
      toast.success('Рекомендация создана и добавлен чекап');
      return true;
    } catch (error) {
      console.error('Ошибка создания рекомендации:', error);
      toast.error('Ошибка создания рекомендации');
      return false;
    }
  };

  const completeCheckup = async (checkupId: string, rating: number, result: string) => {
    try {
      setCheckups(prev => 
        prev.map(checkup => 
          checkup.id === checkupId 
            ? { 
                ...checkup, 
                status: 'completed' as const, 
                rating, 
                result,
                completed_at: new Date().toISOString()
              }
            : checkup
        )
      );
      
      toast.success('Чекап завершен');
      return true;
    } catch (error) {
      console.error('Ошибка завершения чекапа:', error);
      toast.error('Ошибка завершения чекапа');
      return false;
    }
  };

  const getActiveRecommendations = () => {
    return recommendations.filter(r => r.status === 'active');
  };

  const getPendingCheckups = () => {
    return checkups.filter(c => c.status === 'pending').sort((a, b) => 
      new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    );
  };

  const getRecommendationsForAnalytics = () => {
    return recommendations.map(rec => ({
      ...rec,
      checkups: checkups.filter(c => c.recommendation_id === rec.id)
    }));
  };

  return {
    recommendations,
    checkups,
    isLoading,
    createRecommendation,
    completeCheckup,
    getActiveRecommendations,
    getPendingCheckups,
    getRecommendationsForAnalytics,
    refetch: () => {
      loadRecommendations();
      loadCheckups();
    }
  };
};
