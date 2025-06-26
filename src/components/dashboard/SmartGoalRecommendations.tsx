
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { Plus, Loader2 } from 'lucide-react';
import { useSmartRecommendations } from './recommendations/useSmartRecommendations';
import RecommendationCard from './recommendations/RecommendationCard';
import EmptyRecommendationsState from './recommendations/EmptyRecommendationsState';
import GeneratingRecommendationsState from './recommendations/GeneratingRecommendationsState';

const SmartGoalRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const { healthProfile, isLoading: profileLoading } = useHealthProfile();
  const { recommendations, isGenerating, generateRecommendations } = useSmartRecommendations();

  if (profileLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!healthProfile?.healthGoals || healthProfile.healthGoals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Рекомендации для достижения целей
        </h3>
        <EmptyRecommendationsState onNavigateToProfile={() => navigate('/health-profile')} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        Рекомендации для достижения целей
        {isGenerating && <Loader2 className="h-3 w-3 animate-spin" />}
      </h3>
      
      <div className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))
        ) : (
          <GeneratingRecommendationsState 
            isGenerating={isGenerating}
            onRegenerateRecommendations={generateRecommendations}
          />
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/health-profile')}
          className="w-full text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <Plus className="h-3 w-3 mr-1" />
          Персональные рекомендации
        </Button>
      </div>
    </div>
  );
};

export default SmartGoalRecommendations;
