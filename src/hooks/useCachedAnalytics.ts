
import { useState, useEffect, useCallback } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { generateAnalyticsData } from "@/utils/analyticsGenerator";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { fetchHealthProfileData, fetchAnalysesData, fetchChatsData, saveAnalyticsToDatabase } from "@/services/analytics/analyticsDataService";
import { CachedAnalytics } from "@/types/analytics";
import { isDevelopmentMode } from "@/utils/devMode";

export const useCachedAnalytics = () => {
  const { user } = useSmartAuth();
  const { analytics, isLoading: dataLoading, setAnalytics } = useAnalyticsData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasHealthProfile, setHasHealthProfile] = useState(false);
  const [hasAnalyses, setHasAnalyses] = useState(false);

  console.log('🔍 useCachedAnalytics:', { 
    user: user?.email, 
    analytics: !!analytics, 
    isGenerating, 
    hasHealthProfile, 
    hasAnalyses 
  });

  // Check if user has health profile and analyses
  useEffect(() => {
    const checkUserData = async () => {
      if (!user) {
        setHasHealthProfile(false);
        setHasAnalyses(false);
        return;
      }

      try {
        // In dev mode, simulate having data
        if (isDevelopmentMode() && user.id === 'dev-admin-12345') {
          console.log('🔧 Dev mode: Simulating health profile and analyses');
          setHasHealthProfile(true);
          setHasAnalyses(true);
          return;
        }

        // Check health profile
        const profileData = await fetchHealthProfileData(user.id);
        setHasHealthProfile(!!profileData);

        // Check analyses
        const analysesData = await fetchAnalysesData(user.id);
        setHasAnalyses(analysesData.length > 0);

      } catch (error) {
        console.error('Error checking user data:', error);
        setHasHealthProfile(false);
        setHasAnalyses(false);
      }
    };

    checkUserData();
  }, [user]);

  const generateAnalytics = useCallback(async () => {
    if (!user) {
      console.log('No user for analytics generation');
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('🔄 Generating analytics for user:', user.email);

      // In dev mode, generate mock analytics
      if (isDevelopmentMode() && user.id === 'dev-admin-12345') {
        console.log('🔧 Dev mode: Generating mock analytics');
        const mockAnalytics: CachedAnalytics = {
          healthScore: 78,
          riskLevel: 'низкий',
          riskDescription: 'Ваши показатели находятся в оптимальном диапазоне',
          recommendations: [
            'Продолжайте поддерживать активный образ жизни',
            'Регулярно контролируйте показатели здоровья',
            'Сохраняйте сбалансированное питание'
          ],
          strengths: [
            'Отличные показатели физической активности',
            'Регулярный мониторинг здоровья',
            'Проактивный подход к здоровью'
          ],
          concerns: [],
          scoreExplanation: 'Высокая оценка благодаря активному образу жизни и регулярному мониторингу здоровья',
          totalAnalyses: 5,
          totalConsultations: 3,
          lastAnalysisDate: new Date().toISOString(),
          hasRecentActivity: true,
          trendsAnalysis: {
            improving: 4,
            worsening: 0,
            stable: 2
          },
          recentActivities: [
            {
              title: 'Анализ крови загружен',
              time: '2 часа назад',
              icon: 'TestTube',
              iconColor: 'text-blue-600',
              iconBg: 'bg-blue-100'
            },
            {
              title: 'Консультация с ИИ-доктором',
              time: '1 день назад',
              icon: 'MessageCircle',
              iconColor: 'text-green-600',
              iconBg: 'bg-green-100'
            },
            {
              title: 'Обновлен профиль здоровья',
              time: '3 дня назад',
              icon: 'User',
              iconColor: 'text-purple-600',
              iconBg: 'bg-purple-100'
            }
          ],
          lastUpdated: new Date().toISOString()
        };

        setAnalytics(mockAnalytics);
        console.log('🔧 Dev analytics generated:', mockAnalytics);
        return mockAnalytics;
      }

      // Fetch real data
      const [healthProfileData, analysesData, chatsData] = await Promise.all([
        fetchHealthProfileData(user.id).catch(() => null),
        fetchAnalysesData(user.id).catch(() => []),
        fetchChatsData(user.id).catch(() => [])
      ]);

      const analytics = await generateAnalyticsData(
        analysesData, 
        chatsData, 
        !!healthProfileData, 
        healthProfileData
      );

      if (analytics) {
        setAnalytics(analytics);
        await saveAnalyticsToDatabase(user.id, analytics);
        console.log('✅ Analytics generated and saved');
        return analytics;
      }

      console.log('❌ No analytics generated');
      return null;

    } catch (error) {
      console.error('Error generating analytics:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [user, setAnalytics]);

  const generateRealTimeAnalytics = useCallback(async () => {
    console.log('🔄 Generating real-time analytics');
    return await generateAnalytics();
  }, [generateAnalytics]);

  return {
    analytics,
    isLoading: dataLoading,
    isGenerating,
    hasHealthProfile,
    hasAnalyses,
    generateAnalytics,
    generateRealTimeAnalytics
  };
};
