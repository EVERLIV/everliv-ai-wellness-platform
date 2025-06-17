
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthProfileStatus } from "./useHealthProfileStatus";
import { useAnalyticsData } from "./useAnalyticsData";
import { useAnalysesStatus } from "./useAnalysesStatus";
import { generateRealTimeAnalyticsService } from "@/services/analytics/enhancedAnalyticsService";
import { generateBasicAnalyticsService } from "@/services/analytics/basicAnalyticsService";

export const useCachedAnalytics = () => {
  const { user } = useAuth();
  const { isComplete: hasHealthProfile } = useHealthProfileStatus();
  const { analytics, isLoading, setAnalytics } = useAnalyticsData();
  const { hasAnalyses } = useAnalysesStatus();
  const [isGenerating, setIsGenerating] = useState(false);

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
