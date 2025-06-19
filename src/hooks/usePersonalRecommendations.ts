
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { PersonalRecommendation } from '@/types/recommendations';
import { 
  generatePersonalRecommendations, 
  saveRecommendations, 
  fetchUserRecommendations,
  markRecommendationCompleted 
} from '@/services/recommendations-service';
import { toast } from 'sonner';

export const usePersonalRecommendations = () => {
  const { user } = useAuth();
  const { healthProfile } = useHealthProfile();
  const [recommendations, setRecommendations] = useState<PersonalRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userRecommendations = await fetchUserRecommendations(user.id);
      
      // Если рекомендаций нет и есть профиль здоровья, создаем новые
      if (userRecommendations.length === 0 && healthProfile) {
        const newRecommendations = await generatePersonalRecommendations(user.id, healthProfile);
        if (newRecommendations.length > 0) {
          await saveRecommendations(newRecommendations);
          const savedRecommendations = await fetchUserRecommendations(user.id);
          setRecommendations(savedRecommendations);
        }
      } else {
        setRecommendations(userRecommendations);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast.error('Ошибка загрузки рекомендаций');
    } finally {
      setIsLoading(false);
    }
  };

  const completeRecommendation = async (recommendationId: string) => {
    try {
      await markRecommendationCompleted(recommendationId);
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, is_completed: true, completed_at: new Date().toISOString() }
            : rec
        )
      );
      toast.success('Рекомендация отмечена как выполненная');
    } catch (error) {
      console.error('Error completing recommendation:', error);
      toast.error('Ошибка при отметке рекомендации');
    }
  };

  const getCompletedCount = () => {
    return recommendations.filter(rec => rec.is_completed).length;
  };

  const getCompletionPercentage = () => {
    if (recommendations.length === 0) return 0;
    return Math.round((getCompletedCount() / recommendations.length) * 100);
  };

  useEffect(() => {
    loadRecommendations();
  }, [user, healthProfile]);

  return {
    recommendations,
    isLoading,
    completeRecommendation,
    getCompletedCount,
    getCompletionPercentage,
    loadRecommendations
  };
};
