
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BookOpen } from 'lucide-react';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';
import { useIsMobile } from '@/hooks/use-mobile';

interface RecommendationDetailsProps {
  recommendation: AnalyticsRecommendation;
}

const RecommendationDetails: React.FC<RecommendationDetailsProps> = ({
  recommendation
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Научное обоснование */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className={`font-medium text-blue-900 mb-2 flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <BookOpen className="h-4 w-4" />
          Научное обоснование
        </h4>
        <p className={`text-blue-800 ${isMobile ? 'text-xs' : 'text-sm'}`}>{recommendation.scientificBasis}</p>
        <Badge variant="outline" className={`mt-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
          Уровень доказательности: {recommendation.evidenceLevel === 'meta-analysis' ? 'Мета-анализ' :
                                  recommendation.evidenceLevel === 'rct' ? 'РКИ' :
                                  recommendation.evidenceLevel === 'observational' ? 'Наблюдательное' : 'Экспертное мнение'}
        </Badge>
      </div>

      {/* Предупреждения */}
      {(recommendation.safetyWarnings?.length > 0 || recommendation.contraindications?.length > 0) && (
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className={`font-medium text-amber-900 mb-2 flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
            <AlertTriangle className="h-4 w-4" />
            Важные предупреждения
          </h4>
          {recommendation.safetyWarnings?.length > 0 && (
            <div className="mb-2">
              <p className={`font-medium text-amber-800 mb-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>Предупреждения:</p>
              <ul className={`text-amber-800 space-y-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {recommendation.safetyWarnings.map((warning, idx) => (
                  <li key={idx} className={isMobile ? 'text-xs' : 'text-xs'}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
          {recommendation.contraindications?.length > 0 && (
            <div>
              <p className={`font-medium text-amber-800 mb-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>Противопоказания:</p>
              <ul className={`text-amber-800 space-y-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {recommendation.contraindications.map((contra, idx) => (
                  <li key={idx} className={isMobile ? 'text-xs' : 'text-xs'}>• {contra}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* План внедрения */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className={`font-medium text-green-900 mb-3 ${isMobile ? 'text-sm' : ''}`}>План внедрения</h4>
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
          <div>
            <p className={`font-medium text-green-800 mb-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>Пошаговый план:</p>
            <ol className={`text-green-800 space-y-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {recommendation.implementation.steps.map((step, idx) => (
                <li key={idx} className={isMobile ? 'text-xs' : 'text-xs'}>{idx + 1}. {step}</li>
              ))}
            </ol>
          </div>
          <div className="space-y-2">
            <div>
              <p className={`font-medium text-green-800 ${isMobile ? 'text-xs' : 'text-xs'}`}>Длительность:</p>
              <p className={`text-green-700 ${isMobile ? 'text-xs' : 'text-xs'}`}>{recommendation.implementation.duration}</p>
            </div>
            <div>
              <p className={`font-medium text-green-800 ${isMobile ? 'text-xs' : 'text-xs'}`}>Частота:</p>
              <p className={`text-green-700 ${isMobile ? 'text-xs' : 'text-xs'}`}>{recommendation.implementation.frequency}</p>
            </div>
            {recommendation.implementation.dosage && (
              <div>
                <p className={`font-medium text-green-800 ${isMobile ? 'text-xs' : 'text-xs'}`}>Дозировка:</p>
                <p className={`text-green-700 ${isMobile ? 'text-xs' : 'text-xs'}`}>{recommendation.implementation.dosage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecommendationDetails;
