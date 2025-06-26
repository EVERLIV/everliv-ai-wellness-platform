
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  Shield,
  Target,
  Activity
} from 'lucide-react';
import { CachedAnalytics } from '@/types/analytics';
import ModernRecommendationsGrid from './ModernRecommendationsGrid';

interface DetailedHealthRecommendationsProps {
  analytics: CachedAnalytics;
  healthProfile?: any;
}

const DetailedHealthRecommendations: React.FC<DetailedHealthRecommendationsProps> = ({ 
  analytics, 
  healthProfile 
}) => {
  return (
    <div className="space-y-8">
      {/* Детальные рекомендации с новыми компонентами */}
      <ModernRecommendationsGrid analytics={analytics} healthProfile={healthProfile} />

      {/* Объяснение балла */}
      {analytics.scoreExplanation && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Brain className="h-5 w-5" />
              Как рассчитывается балл здоровья
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              {analytics.scoreExplanation}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedHealthRecommendations;
