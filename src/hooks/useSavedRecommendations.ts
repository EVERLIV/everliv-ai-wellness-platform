import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export interface SavedRecommendation {
  id: string;
  user_id: string;
  recommendation_hash: string;
  analysis_name: string;
  analysis_type: string;
  priority: string;
  reason: string;
  scheduled_date?: string;
  event_id?: string;
  status: 'planned' | 'completed' | 'cancelled';
  recommendation_data: any;
  created_at: string;
  updated_at: string;
}

export interface AnalysisRecommendation {
  name: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  optimal_timing: string;
  preparation: string;
  frequency: string;
  cost_estimate: string;
  biomarkers: string[];
}

export const useSavedRecommendations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Генерация хэша для рекомендации для проверки дубликатов
  const generateRecommendationHash = (recommendation: AnalysisRecommendation): string => {
    const key = `${recommendation.name}_${recommendation.type}_${recommendation.priority}`;
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  };

  // Загрузка сохраненных рекомендаций
  const fetchSavedRecommendations = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_analysis_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching saved recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Сохранение рекомендации
  const saveRecommendation = async (
    recommendation: AnalysisRecommendation, 
    scheduledDate?: Date,
    eventId?: string
  ): Promise<SavedRecommendation | null> => {
    if (!user) return null;

    const recommendationHash = generateRecommendationHash(recommendation);

    try {
      // Проверяем, не сохранена ли уже такая рекомендация
      const { data: existing } = await supabase
        .from('saved_analysis_recommendations')
        .select('id')
        .eq('user_id', user.id)
        .eq('recommendation_hash', recommendationHash)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Рекомендация уже сохранена",
          description: "Эта рекомендация уже добавлена в ваш список",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('saved_analysis_recommendations')
        .insert({
          user_id: user.id,
          recommendation_hash: recommendationHash,
          analysis_name: recommendation.name,
          analysis_type: recommendation.type,
          priority: recommendation.priority,
          reason: recommendation.reason,
          scheduled_date: scheduledDate ? format(scheduledDate, 'yyyy-MM-dd') : null,
          event_id: eventId,
          recommendation_data: recommendation
        })
        .select()
        .single();

      if (error) throw error;

      setSavedRecommendations(prev => [data, ...prev]);
      
      toast({
        title: "Рекомендация сохранена",
        description: `${recommendation.name} добавлен в ваш список`
      });

      return data;
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить рекомендацию",
        variant: "destructive"
      });
      return null;
    }
  };

  // Проверка, сохранена ли рекомендация
  const isRecommendationSaved = (recommendation: AnalysisRecommendation): boolean => {
    const hash = generateRecommendationHash(recommendation);
    return savedRecommendations.some(saved => saved.recommendation_hash === hash);
  };

  // Получение сохраненных хэшей для фильтрации дубликатов
  const getSavedHashes = (): string[] => {
    return savedRecommendations.map(rec => rec.recommendation_hash);
  };

  // Обновление статуса рекомендации
  const updateRecommendationStatus = async (
    id: string, 
    status: 'planned' | 'completed' | 'cancelled'
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_analysis_recommendations')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, status } : rec)
      );

      return true;
    } catch (error) {
      console.error('Error updating recommendation status:', error);
      return false;
    }
  };

  // Связывание рекомендации с событием
  const linkRecommendationToEvent = async (
    recommendationId: string, 
    eventId: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_analysis_recommendations')
        .update({ event_id: eventId })
        .eq('id', recommendationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedRecommendations(prev => 
        prev.map(rec => rec.id === recommendationId ? { ...rec, event_id: eventId } : rec)
      );

      return true;
    } catch (error) {
      console.error('Error linking recommendation to event:', error);
      return false;
    }
  };

  // Удаление сохраненной рекомендации
  const deleteSavedRecommendation = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_analysis_recommendations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedRecommendations(prev => prev.filter(rec => rec.id !== id));
      
      toast({
        title: "Рекомендация удалена",
        description: "Рекомендация успешно удалена"
      });

      return true;
    } catch (error) {
      console.error('Error deleting saved recommendation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить рекомендацию",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedRecommendations();
    }
  }, [user]);

  return {
    savedRecommendations,
    isLoading,
    fetchSavedRecommendations,
    saveRecommendation,
    isRecommendationSaved,
    getSavedHashes,
    updateRecommendationStatus,
    linkRecommendationToEvent,
    deleteSavedRecommendation,
    generateRecommendationHash
  };
};