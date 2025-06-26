
import React from "react";
import HealthRecommendationsManager from "@/components/health-recommendations/HealthRecommendationsManager";

const HealthTrackingSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Управление здоровьем</h2>
        <p className="text-gray-600 mb-6">
          Создавайте рекомендации для улучшения здоровья и отслеживайте прогресс через чекапы
        </p>
      </div>
      
      <HealthRecommendationsManager />
    </div>
  );
};

export default HealthTrackingSection;
