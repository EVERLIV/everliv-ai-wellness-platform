
import React, { useMemo } from "react";
import { Activity } from "lucide-react";
import { generateDetailedRecommendations } from "@/utils/detailedRecommendationsGenerator";
import { HealthProfileData } from "@/types/healthProfile";
import { CachedAnalytics } from "@/types/analytics";
import ModernHealthRecommendations from "./ModernHealthRecommendations";
import ModernRecommendationsGrid from "./ModernRecommendationsGrid";

interface DetailedHealthRecommendationsProps {
  analytics: CachedAnalytics | null;
  healthProfile: HealthProfileData | null;
}

const DetailedHealthRecommendations: React.FC<DetailedHealthRecommendationsProps> = ({
  analytics,
  healthProfile
}) => {
  const detailedRecommendations = useMemo(() => {
    if (!analytics) return null;
    return generateDetailedRecommendations(analytics, healthProfile);
  }, [analytics, healthProfile]);

  if (!detailedRecommendations) {
    return (
      <div className="text-center py-8">
        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Детальные рекомендации недоступны
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Для получения детальных рекомендаций необходимы данные аналитики здоровья
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Современные практики здоровья */}
      <ModernHealthRecommendations 
        healthProfile={healthProfile}
        analytics={analytics}
      />
      
      {/* Основные рекомендации в современном стиле */}
      <ModernRecommendationsGrid 
        analytics={analytics}
        healthProfile={healthProfile}
      />
    </div>
  );
};

export default DetailedHealthRecommendations;
