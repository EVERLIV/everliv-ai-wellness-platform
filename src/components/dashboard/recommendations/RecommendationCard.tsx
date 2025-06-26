
import React from 'react';
import { Clock } from 'lucide-react';
import { SmartRecommendation } from './types';
import { getCategoryIcon, getCategoryColors } from './categoryUtils';

interface RecommendationCardProps {
  recommendation: SmartRecommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const colors = getCategoryColors(recommendation.category);
  const IconComponent = getCategoryIcon(recommendation.category);

  return (
    <div className={`p-3 bg-gradient-to-r ${colors.bg} rounded-lg border ${colors.border}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <IconComponent className={`h-4 w-4 ${colors.iconColor}`} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {recommendation.title}
          </h4>
          <p className="text-xs text-gray-600 mb-2">
            {recommendation.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{recommendation.timeframe}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
