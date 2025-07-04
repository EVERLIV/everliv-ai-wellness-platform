
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, TrendingUp, Activity, Loader2 } from 'lucide-react';
import BiomarkerTrendChart from './BiomarkerTrendChart';
import BiomarkerStatus from './BiomarkerStatus';
import { generateBiomarkerRecommendation } from '@/services/ai/biomarker-recommendations';
import { useAuth } from '@/contexts/AuthContext';

interface BiomarkerCardProps {
  name: string;
  value: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  recommendation?: string;
  detailedRecommendation?: string;
}

interface DetailedRecommendations {
  dietaryRecommendations: string[];
  lifestyleChanges: string[];
  supplementsToConsider: string[];
  whenToRetest: string;
  warningSignsToWatch: string[];
  additionalTests: string[];
}

const BiomarkerCard: React.FC<BiomarkerCardProps> = ({
  name,
  value,
  normalRange,
  status,
  recommendation,
  detailedRecommendation
}) => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [showTrend, setShowTrend] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<DetailedRecommendations | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);

  const handleShowDetails = async () => {
    if (!showDetails && !aiRecommendations && status !== 'normal' && user) {
      setIsLoadingRecommendations(true);
      setRecommendationsError(null);
      
      try {
        const recommendations = await generateBiomarkerRecommendation({
          biomarkerName: name,
          currentValue: value,
          normalRange: normalRange,
          status: status,
          userId: user.id
        });
        
        if (recommendations) {
          setAiRecommendations(recommendations);
        } else {
          setRecommendationsError('Не удалось получить рекомендации. Попробуйте позже.');
        }
      } catch (error) {
        console.error('Error loading AI recommendations:', error);
        setRecommendationsError('Ошибка загрузки рекомендаций. Попробуйте позже.');
      } finally {
        setIsLoadingRecommendations(false);
      }
    }
    setShowDetails(!showDetails);
  };

  const shouldShowDetailedRecommendations = status !== 'normal';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{name}</CardTitle>
          <BiomarkerStatus status={status} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Значение:</span>
            <span className="font-semibold">{value}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Норма:</span>
            <span className="text-gray-500">{normalRange}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Базовая рекомендация */}
        {recommendation && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{recommendation}</p>
          </div>
        )}

        {/* Кнопки для раскрытия дополнительной информации */}
        <div className="flex gap-2">
          {shouldShowDetailedRecommendations && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleShowDetails}
            >
              {isLoadingRecommendations ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : showDetails ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <TrendingUp className="h-4 w-4" />
              ИИ-рекомендации
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowTrend(!showTrend)}
          >
            {showTrend ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <Activity className="h-4 w-4" />
            Динамика
          </Button>
        </div>

        {/* Контент всегда в одном месте */}
        <div className="space-y-3">
          {/* ИИ-рекомендации */}
          {shouldShowDetailedRecommendations && showDetails && (
            <div className="border-l-4 border-blue-500 pl-4">
              {isLoadingRecommendations ? (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Генерируем персональные рекомендации...</span>
                  </div>
                </div>
              ) : recommendationsError ? (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">{recommendationsError}</p>
                </div>
              ) : aiRecommendations ? (
                <div className="space-y-4">
                  {/* Питание */}
                  {aiRecommendations.dietaryRecommendations.length > 0 && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">🥗 Рекомендации по питанию:</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        {aiRecommendations.dietaryRecommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Образ жизни */}
                  {aiRecommendations.lifestyleChanges.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">🏃‍♂️ Изменения образа жизни:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {aiRecommendations.lifestyleChanges.map((change, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Добавки */}
                  {aiRecommendations.supplementsToConsider.length > 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-medium text-orange-900 mb-2">💊 Добавки для рассмотрения с врачом:</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        {aiRecommendations.supplementsToConsider.map((supplement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>{supplement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Когда пересдать */}
                  {aiRecommendations.whenToRetest && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900 mb-2">📅 Когда пересдать анализ:</h4>
                      <p className="text-sm text-purple-800">{aiRecommendations.whenToRetest}</p>
                    </div>
                  )}

                  {/* Тревожные симптомы */}
                  {aiRecommendations.warningSignsToWatch.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-900 mb-2">⚠️ Симптомы, требующие внимания:</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        {aiRecommendations.warningSignsToWatch.map((symptom, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">•</span>
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Дополнительные анализы */}
                  {aiRecommendations.additionalTests.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">🔬 Дополнительные анализы:</h4>
                      <ul className="text-sm text-gray-800 space-y-1">
                        {aiRecommendations.additionalTests.map((test, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-gray-600 mt-1">•</span>
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">Рекомендации временно недоступны. Попробуйте позже.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Динамика */}
          {showTrend && (
            <div className="border-l-4 border-purple-500 pl-4">
              <BiomarkerTrendChart biomarkerName={name} />
            </div>
          )}
        </div>

        {/* Показываем сообщение только для нормальных показателей */}
        {!shouldShowDetailedRecommendations && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">✅ Показатель в норме - дополнительные рекомендации не требуются</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BiomarkerCard;
