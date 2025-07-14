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

// Версия алгоритма рекомендаций - увеличивайте при изменении логики
const RECOMMENDATIONS_VERSION = 'v1.5.0';

// Функция для создания хэша источников данных с версионностью (Unicode-safe)
const createSourceHash = (data: any, type: RecommendationType): string => {
  try {
    if (!data || typeof data !== 'object') {
      return `empty-data-${RECOMMENDATIONS_VERSION}`;
    }
    
    // Добавляем версию и тип в хэш для автоматической инвалидации при обновлениях
    const hashInput = {
      version: RECOMMENDATIONS_VERSION,
      type: type,
      timestamp: new Date().toISOString().split('T')[0], // Дата для ежедневной ротации
      data: data
    };
    
    const hashData = JSON.stringify(hashInput);
    // Используем encodeURIComponent для обработки Unicode символов
    const safeString = encodeURIComponent(hashData);
    return btoa(safeString).slice(0, 32);
  } catch (error) {
    console.warn('Error creating source hash, using fallback:', error);
    // Fallback: простой хэш на основе версии и времени
    return `fallback-${RECOMMENDATIONS_VERSION}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

export const useCachedRecommendations = (
  type: RecommendationType,
  sourceData: any,
  generatorFunction: () => Promise<any[]>,
  forceRegenerate: boolean = false
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

      if (data && !forceRegenerate) {
        try {
          const currentHash = createSourceHash(sourceData, type);
          const cacheAge = Date.now() - new Date(data.updated_at).getTime();
          const maxCacheAge = 24 * 60 * 60 * 1000; // 24 часа
          
          console.log(`📊 Cache analysis for ${type}:`, {
            currentHash: currentHash.slice(0, 8),
            cachedHash: data.source_hash?.slice(0, 8),
            cacheAge: Math.round(cacheAge / (60 * 1000)), // в минутах
            maxCacheAgeHours: maxCacheAge / (60 * 60 * 1000),
            hashMatch: data.source_hash === currentHash,
            isExpired: cacheAge > maxCacheAge
          });
          
          // Проверяем, актуальны ли кэшированные данные (хэш + возраст)
          if (data.source_hash === currentHash && cacheAge < maxCacheAge) {
            setRecommendations(data.recommendations_data);
            setLastUpdated(new Date(data.updated_at));
            console.log(`✅ Loaded cached ${type} recommendations (${Math.round(cacheAge / (60 * 1000))}m old):`, {
              count: data.recommendations_data?.length || 0,
              hash: currentHash.slice(0, 8)
            });
          } else {
            const reason = data.source_hash !== currentHash ? 'hash mismatch' : 'cache expired';
            console.log(`🔄 Cache invalid for ${type} (${reason}), generating new recommendations`);
            await generateNewRecommendations();
          }
        } catch (error) {
          console.error('Error processing cached data, regenerating:', error);
          await generateNewRecommendations();
        }
      } else {
        const reason = forceRegenerate ? 'force regenerate' : 'no cache found';
        console.log(`📝 ${reason} for ${type}, generating new recommendations`);
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

      const newHash = createSourceHash(sourceData, type);
      const now = new Date();
      
      console.log(`💾 Saving ${type} recommendations to cache:`, {
        count: newRecommendations.length,
        hash: newHash.slice(0, 8),
        timestamp: now.toISOString()
      });

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

  // Принудительная регенерация с удалением старого кэша
  const regenerateRecommendations = async () => {
    console.log(`🔄 Force regenerating ${type} recommendations`);
    
    // Удаляем старый кэш перед генерацией новых
    if (user) {
      try {
        await supabase
          .from('cached_recommendations')
          .delete()
          .eq('user_id', user.id)
          .eq('recommendations_type', type);
        console.log(`🗑️ Cleared old ${type} cache`);
      } catch (error) {
        console.warn('Error clearing old cache:', error);
      }
    }
    
    await generateNewRecommendations();
  };

  // Очистка устаревших кэшей при запуске
  const cleanupOldCache = async () => {
    if (!user) return;
    
    try {
      // Удаляем кэши старше 7 дней
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      await supabase
        .from('cached_recommendations')
        .delete()
        .eq('user_id', user.id)
        .lt('updated_at', weekAgo);
    } catch (error) {
      console.warn('Error cleaning up old cache:', error);
    }
  };

  // Эффект для загрузки рекомендаций при изменении пользователя, типа или данных
  useEffect(() => {
    if (user && sourceData && Object.keys(sourceData).length > 0) {
      console.log(`🔄 Loading ${type} recommendations for user`, { 
        sourceDataKeys: Object.keys(sourceData),
        version: RECOMMENDATIONS_VERSION 
      });
      cleanupOldCache(); // Очищаем старые кэши
      loadCachedRecommendations();
    } else {
      console.log(`⚠️ Missing data for ${type} recommendations:`, { 
        hasUser: !!user, 
        hasSourceData: !!sourceData,
        sourceDataKeys: sourceData ? Object.keys(sourceData) : [],
        version: RECOMMENDATIONS_VERSION
      });
      setIsLoading(false);
    }
  }, [user, type, JSON.stringify(sourceData), forceRegenerate]); // Добавляем forceRegenerate в зависимости

  return {
    recommendations,
    isLoading,
    isGenerating,
    regenerateRecommendations,
    lastUpdated
  };
};