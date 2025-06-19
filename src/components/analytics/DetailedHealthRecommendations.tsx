
import React, { useMemo } from "react";
import { Activity } from "lucide-react";
import { generateDetailedRecommendations } from "@/utils/detailedRecommendationsGenerator";
import { HealthProfileData } from "@/types/healthProfile";
import { CachedAnalytics } from "@/types/analytics";
import ModernRecommendationsGrid from "./ModernRecommendationsGrid";
import ModernHealthPracticesCards from "./ModernHealthPracticesCards";

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
      {/* Основные рекомендации в современном стиле - главный блок */}
      <ModernRecommendationsGrid 
        analytics={analytics}
        healthProfile={healthProfile}
      />
      
      {/* Современные практики здоровья - внизу страницы */}
      <ModernHealthPracticesCards 
        healthProfile={healthProfile}
        analytics={analytics}
      />
    </div>
  );
};

export default DetailedHealthRecommendations;
