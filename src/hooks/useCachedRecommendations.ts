import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';
import { SmartRecommendation } from '@/components/dashboard/recommendations/types';
import { toast } from '@/hooks/use-toast';

type RecommendationType = 'analytics' | 'dashboard';

interface CachedRecommendationsHook {
  recommendations: AnalyticsRecommendation[] | SmartRecommendation[];
  isLoading: boolean;
  isGenerating: boolean;
  regenerateRecommendations: () => Promise<void>;
  lastUpdated: Date | null;
}

// Функция для создания хэша источников данных (Unicode-safe)
const createSourceHash = (data: any): string => {
  try {
    if (!data || typeof data !== 'object') {
      return 'empty-data';
    }
    
    const hashData = JSON.stringify(data);
    // Используем encodeURIComponent для обработки Unicode символов
    const safeString = encodeURIComponent(hashData);
    return btoa(safeString).slice(0, 32);
  } catch (error) {
    console.warn('Error creating source hash, using fallback:', error);
    // Fallback: простой хэш на основе длины и случайного числа
    return `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

export const useCachedRecommendations = (
  type: RecommendationType,
  sourceData: any,
  generatorFunction: () => Promise<any[]>
): CachedRecommendationsHook => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Загрузка кэшированных рекомендаций
  const loadCachedRecommendations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('cached_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('recommendations_type', type)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading cached recommendations:', error);
        return;
      }

      if (data) {
        try {
          const currentHash = createSourceHash(sourceData);
          
          // Проверяем, актуальны ли кэшированные данные
          if (data.source_hash === currentHash) {
            setRecommendations(data.recommendations_data);
            setLastUpdated(new Date(data.updated_at));
            console.log(`✅ Loaded cached ${type} recommendations:`, data.recommendations_data);
          } else {
            console.log(`🔄 Source data changed for ${type}, generating new recommendations`);
            await generateNewRecommendations();
          }
        } catch (error) {
          console.error('Error processing cached data, regenerating:', error);
          await generateNewRecommendations();
        }
      } else {
        console.log(`📝 No cached recommendations found for ${type}, generating new ones`);
        await generateNewRecommendations();
      }
    } catch (error) {
      console.error('Error in loadCachedRecommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Генерация новых рекомендаций
  const generateNewRecommendations = async () => {
    if (!user || !sourceData) {
      console.log(`❌ Cannot generate ${type} recommendations:`, { hasUser: !!user, hasSourceData: !!sourceData });
      return;
    }

    // Валидация sourceData
    if (typeof sourceData !== 'object' || Object.keys(sourceData).length === 0) {
      console.warn(`⚠️ Invalid sourceData for ${type} recommendations:`, sourceData);
      return;
    }

    try {
      console.log(`🔄 Generating new ${type} recommendations with data:`, sourceData);
      setIsGenerating(true);
      
      const newRecommendations = await generatorFunction();
      if (!newRecommendations || !Array.isArray(newRecommendations)) {
        console.error('Invalid recommendations data:', newRecommendations);
        return;
      }

      const newHash = createSourceHash(sourceData);
      const now = new Date();

      // Сохраняем в кэш
      const { error } = await supabase
        .from('cached_recommendations')
        .upsert({
          user_id: user.id,
          recommendations_type: type,
          recommendations_data: newRecommendations,
          source_hash: newHash,
          updated_at: now.toISOString()
        }, {
          onConflict: 'user_id,recommendations_type'
        });

      if (error) {
        console.error('Error saving cached recommendations:', error);
        toast({
          title: "Ошибка сохранения",
          description: "Не удалось сохранить рекомендации в кэш",
          variant: "destructive",
        });
        return;
      }

      setRecommendations(newRecommendations);
      setLastUpdated(now);
      
      console.log(`✅ Generated and cached new ${type} recommendations:`, newRecommendations);
      
      toast({
        title: "Рекомендации обновлены",
        description: `Сгенерировано ${newRecommendations.length} новых рекомендаций`,
      });

    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Ошибка генерации",
        description: "Не удалось сгенерировать рекомендации",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Принудительная регенерация
  const regenerateRecommendations = async () => {
    await generateNewRecommendations();
  };

  // Эффект для загрузки рекомендаций при изменении пользователя, типа или данных
  useEffect(() => {
    if (user && sourceData && Object.keys(sourceData).length > 0) {
      console.log(`🔄 Loading ${type} recommendations for user`, { sourceData });
      loadCachedRecommendations();
    } else {
      console.log(`⚠️ Missing data for ${type} recommendations:`, { 
        hasUser: !!user, 
        hasSourceData: !!sourceData,
        sourceDataKeys: sourceData ? Object.keys(sourceData) : []
      });
      setIsLoading(false);
    }
  }, [user, type, JSON.stringify(sourceData)]); // Добавляем sourceData в зависимости

  return {
    recommendations,
    isLoading,
    isGenerating,
    regenerateRecommendations,
    lastUpdated
  };
};