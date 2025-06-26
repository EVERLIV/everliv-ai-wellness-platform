
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Beaker, BookOpen, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AnalyticsRecommendation } from '@/types/analyticsRecommendations';
import { CachedAnalytics } from '@/types/analytics';

interface EnhancedAnalyticsRecommendationsProps {
  analytics: CachedAnalytics;
  healthProfile?: any;
}

const EnhancedAnalyticsRecommendations: React.FC<EnhancedAnalyticsRecommendationsProps> = ({
  analytics,
  healthProfile
}) => {
  const [recommendations, setRecommendations] = useState<AnalyticsRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-analytics-recommendations', {
        body: {
          analytics,
          healthProfile
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast.error('Ошибка при генерации рекомендаций');
        return;
      }

      if (data?.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
        toast.success('Современные рекомендации готовы!');
      } else {
        toast.error('Не удалось получить рекомендации');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Ошибка при генерации рекомендаций');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [analytics]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-blue-100 text-blue-800';
      case 'sleep': return 'bg-purple-100 text-purple-800';
      case 'stress': return 'bg-amber-100 text-amber-800';
      case 'supplements': return 'bg-teal-100 text-teal-800';
      case 'biohacking': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Beaker className="h-6 w-6 text-blue-600" />
            Современные рекомендации ИИ-доктора
          </h2>
          <p className="text-gray-600 mt-1">
            Персональные рекомендации на основе доказательной медицины и биохакинга
          </p>
        </div>
        <Button
          onClick={generateRecommendations}
          disabled={isGenerating}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Генерируем...' : 'Обновить'}
        </Button>
      </div>

      {recommendations.length === 0 && !isGenerating && (
        <Card>
          <CardContent className="py-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Рекомендации загружаются...</p>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Генерируем персональные рекомендации...</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'critical' ? 'Критично' :
                       rec.priority === 'high' ? 'Высокий' :
                       rec.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                    </Badge>
                    <Badge className={getCategoryColor(rec.category)}>
                      {rec.category === 'nutrition' ? 'Питание' :
                       rec.category === 'exercise' ? 'Активность' :
                       rec.category === 'sleep' ? 'Сон' :
                       rec.category === 'stress' ? 'Стресс' :
                       rec.category === 'supplements' ? 'Добавки' : 'Биохакинг'}
                    </Badge>
                    <Badge variant="outline">
                      {rec.biohackingLevel === 'beginner' ? 'Начальный' :
                       rec.biohackingLevel === 'intermediate' ? 'Средний' : 'Продвинутый'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">
                    {rec.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    {rec.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(rec.id)}
                  className="ml-4"
                >
                  {expandedCards.has(rec.id) ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </div>
            </CardHeader>

            {expandedCards.has(rec.id) && (
              <CardContent className="pt-0 space-y-4">
                {/* Научное обоснование */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Научное обоснование
                  </h4>
                  <p className="text-blue-800 text-sm">{rec.scientificBasis}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    Уровень доказательности: {rec.evidenceLevel === 'meta-analysis' ? 'Мета-анализ' :
                                            rec.evidenceLevel === 'rct' ? 'РКИ' :
                                            rec.evidenceLevel === 'observational' ? 'Наблюдательное' : 'Экспертное мнение'}
                  </Badge>
                </div>

                {/* Предупреждения */}
                {(rec.safetyWarnings?.length > 0 || rec.contraindications?.length > 0) && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Важные предупреждения
                    </h4>
                    {rec.safetyWarnings?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-amber-800 mb-1">Предупреждения:</p>
                        <ul className="text-amber-800 text-sm space-y-1">
                          {rec.safetyWarnings.map((warning, idx) => (
                            <li key={idx} className="text-xs">• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {rec.contraindications?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-amber-800 mb-1">Противопоказания:</p>
                        <ul className="text-amber-800 text-sm space-y-1">
                          {rec.contraindications.map((contra, idx) => (
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
                        {rec.implementation.steps.map((step, idx) => (
                          <li key={idx} className="text-xs">{idx + 1}. {step}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-green-800">Длительность:</p>
                        <p className="text-xs text-green-700">{rec.implementation.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-800">Частота:</p>
                        <p className="text-xs text-green-700">{rec.implementation.frequency}</p>
                      </div>
                      {rec.implementation.dosage && (
                        <div>
                          <p className="text-xs font-medium text-green-800">Дозировка:</p>
                          <p className="text-xs text-green-700">{rec.implementation.dosage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnhancedAnalyticsRecommendations;
