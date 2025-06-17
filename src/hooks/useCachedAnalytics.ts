
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthProfileStatus } from "./useHealthProfileStatus";
import { useAnalyticsData } from "./useAnalyticsData";
import { useAnalysesStatus } from "./useAnalysesStatus";
import { generateRealTimeAnalyticsService } from "@/services/analytics/enhancedAnalyticsService";
import { generateBasicAnalyticsService } from "@/services/analytics/basicAnalyticsService";
import { realtimeAnalyticsService } from "@/services/analytics/realtimeAnalyticsService";

export const useCachedAnalytics = () => {
  const { user } = useAuth();
  const { isComplete: hasHealthProfile } = useHealthProfileStatus();
  const { analytics, isLoading, setAnalytics } = useAnalyticsData();
  const { hasAnalyses } = useAnalysesStatus();
  const [isGenerating, setIsGenerating] = useState(false);
  const subscriptionRef = useRef(false);

  // Подписываемся на изменения в реальном времени только один раз
  useEffect(() => {
    if (!user || !hasHealthProfile || subscriptionRef.current) return;

    console.log('Setting up realtime analytics for user:', user.id);
    
    realtimeAnalyticsService.subscribeToUserChanges(user.id, setAnalytics);
    subscriptionRef.current = true;

    return () => {
      if (subscriptionRef.current) {
        realtimeAnalyticsService.unsubscribeFromUserChanges(user.id);
        subscriptionRef.current = false;
      }
    };
  }, [user, hasHealthProfile, setAnalytics]);

  const generateRealTimeAnalytics = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      await generateRealTimeAnalyticsService(user.id, hasHealthProfile, setAnalytics);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAnalytics = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      await generateBasicAnalyticsService(user.id, hasHealthProfile, setAnalytics);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    analytics,
    isLoading,
    isGenerating,
    hasHealthProfile,
    hasAnalyses,
    generateAnalytics,
    generateRealTimeAnalytics
  };
};
