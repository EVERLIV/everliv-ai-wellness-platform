
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BookOpen } from 'lucide-react';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';

interface RecommendationDetailsProps {
  recommendation: AnalyticsRecommendation;
}

const RecommendationDetails: React.FC<RecommendationDetailsProps> = ({
  recommendation
}) => {
  return (
    <>
      {/* Научное обоснование */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Научное обоснование
        </h4>
        <p className="text-blue-800 text-sm">{recommendation.scientificBasis}</p>
        <Badge variant="outline" className="mt-2 text-xs">
          Уровень доказательности: {recommendation.evidenceLevel === 'meta-analysis' ? 'Мета-анализ' :
                                  recommendation.evidenceLevel === 'rct' ? 'РКИ' :
                                  recommendation.evidenceLevel === 'observational' ? 'Наблюдательное' : 'Экспертное мнение'}
        </Badge>
      </div>

      {/* Предупреждения */}
      {(recommendation.safetyWarnings?.length > 0 || recommendation.contraindications?.length > 0) && (
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Важные предупреждения
          </h4>
          {recommendation.safetyWarnings?.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium text-amber-800 mb-1">Предупреждения:</p>
              <ul className="text-amber-800 text-sm space-y-1">
                {recommendation.safetyWarnings.map((warning, idx) => (
                  <li key={idx} className="text-xs">• {warning}</li>
                ))}
              </ul>
            </div>
          )}
          {recommendation.contraindications?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-amber-800 mb-1">Противопоказания:</p>
              <ul className="text-amber-800 text-sm space-y-1">
                {recommendation.contraindications.map((contra, idx) => (
                  <li key={idx} className="text-xs">• {contra}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* План внедрения */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-3">План внедрения</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-green-800 mb-2">Пошаговый план:</p>
            <ol className="text-green-800 text-sm space-y-1">
              {recommendation.implementation.steps.map((step, idx) => (
                <li key={idx} className="text-xs">{idx + 1}. {step}</li>
              ))}
            </ol>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-green-800">Длительность:</p>
              <p className="text-xs text-green-700">{recommendation.implementation.duration}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-green-800">Частота:</p>
              <p className="text-xs text-green-700">{recommendation.implementation.frequency}</p>
            </div>
            {recommendation.implementation.dosage && (
              <div>
                <p className="text-xs font-medium text-green-800">Дозировка:</p>
                <p className="text-xs text-green-700">{recommendation.implementation.dosage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecommendationDetails;
