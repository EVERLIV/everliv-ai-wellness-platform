import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, TestTube, Calendar, Clock, AlertTriangle, Banknote, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AddEventDialog from '@/components/health-calendar/AddEventDialog';

interface RecommendedAnalysesProps {
  currentDate: Date;
  selectedDate?: Date;
}

interface AnalysisRecommendation {
  name: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  optimal_timing: string;
  preparation: string;
  frequency: string;
  cost_estimate: string;
  biomarkers: string[];
}

interface UrgentRecommendation {
  name: string;
  reason: string;
  deadline: string;
}

interface RecommendationsData {
  recommendations: AnalysisRecommendation[];
  urgent_recommendations: UrgentRecommendation[];
  seasonal_note: string;
}

const RecommendedAnalyses = ({ currentDate, selectedDate }: RecommendedAnalysesProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const generateRecommendations = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-analysis-recommendations', {
        body: {
          user_id: user.id,
          selected_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
        }
      });

      if (error) throw error;

      setRecommendations(data);
      // Показываем тост только если есть рекомендации
      if (data?.recommendations?.length > 0 || data?.urgent_recommendations?.length > 0) {
        toast({
          title: "Рекомендации обновлены",
          description: "Получены персональные рекомендации по анализам"
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить рекомендации",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      generateRecommendations();
    }
  }, [selectedDate, user]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blood': return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'urine': return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'other': return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4 text-[10px] text-muted-foreground">
        Войдите в систему для получения рекомендаций
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium">
          Рекомендуемые анализы
        </div>
        <Button
          variant="outline"
          size="xs"
          onClick={generateRecommendations}
          disabled={isLoading}
          className="h-6 px-2 text-xs rounded-none border-gray-300"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <TestTube className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Date */}
      <div className="text-[10px] text-muted-foreground">
        На {format(selectedDate || new Date(), 'd MMMM yyyy', { locale: ru })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Urgent Recommendations */}
          {recommendations?.urgent_recommendations && recommendations.urgent_recommendations.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-medium text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Срочные рекомендации
              </div>
              {recommendations.urgent_recommendations.map((urgent, index) => (
                <Card key={index} className="shadow-none border-red-200 rounded-none bg-red-50">
                  <CardContent className="p-2">
                    <div className="text-[10px] font-medium text-red-800">{urgent.name}</div>
                    <div className="text-[9px] text-red-700 mt-0.5">{urgent.reason}</div>
                    <div className="text-[9px] text-red-600 mt-0.5 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      До {urgent.deadline}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Regular Recommendations */}
          <div className="space-y-1">
            {recommendations?.recommendations?.length === 0 ? (
              <div className="text-center py-4 text-[10px] text-muted-foreground">
                Нет рекомендаций для выбранной даты
              </div>
            ) : (
              recommendations?.recommendations?.map((analysis, index) => (
                <Card key={index} className="shadow-none border-gray-200/80 rounded-none">
                  <CardContent className="p-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          {getTypeIcon(analysis.type)}
                          <Badge className={`text-[8px] px-1 py-0 h-auto rounded-none ${getPriorityColor(analysis.priority)}`}>
                            {analysis.priority === 'high' ? 'Высокий' : 
                             analysis.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </Badge>
                        </div>
                        
                        <div className="text-[10px] font-medium mb-0.5">
                          {analysis.name}
                        </div>
                        
                        <div className="text-[9px] text-muted-foreground mb-1">
                          {analysis.reason}
                        </div>
                        
                        {expandedCard === index && (
                          <div className="space-y-1 mt-2 pt-2 border-t border-gray-200">
                            <div className="flex items-start gap-1">
                              <Clock className="h-2.5 w-2.5 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="text-[9px] font-medium">Когда сдать:</div>
                                <div className="text-[9px] text-muted-foreground">{analysis.optimal_timing}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-1">
                              <FileText className="h-2.5 w-2.5 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="text-[9px] font-medium">Подготовка:</div>
                                <div className="text-[9px] text-muted-foreground">{analysis.preparation}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-1">
                              <Calendar className="h-2.5 w-2.5 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="text-[9px] font-medium">Частота:</div>
                                <div className="text-[9px] text-muted-foreground">{analysis.frequency}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-1">
                              <Banknote className="h-2.5 w-2.5 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="text-[9px] font-medium">Стоимость:</div>
                                <div className="text-[9px] text-muted-foreground">{analysis.cost_estimate}</div>
                              </div>
                            </div>
                            
                            {analysis.biomarkers.length > 0 && (
                              <div>
                                <div className="text-[9px] font-medium mb-0.5">Биомаркеры:</div>
                                <div className="flex flex-wrap gap-0.5">
                                  {analysis.biomarkers.map((biomarker, i) => (
                                    <Badge key={i} variant="outline" className="text-[8px] px-1 py-0 h-auto rounded-none">
                                      {biomarker}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                        className="h-5 w-5 p-0 rounded-none ml-2"
                      >
                        <div className={`text-[10px] transition-transform ${expandedCard === index ? 'rotate-180' : ''}`}>
                          ↓
                        </div>
                      </Button>
                      <AddEventDialog 
                        selectedDate={selectedDate || new Date()}
                        prefilledData={{
                          title: `Анализ: ${analysis.name}`,
                          description: analysis.reason,
                          event_type: 'analysis',
                          priority: analysis.priority,
                          related_data: { analysis_recommendation: analysis }
                        }}
                        triggerButton={
                          <Button
                            variant="ghost"
                            size="xs"
                            className="h-5 w-5 p-0 rounded-none ml-1"
                            title="Добавить в календарь"
                          >
                            +
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Seasonal Note */}
          {recommendations?.seasonal_note && (
            <Card className="shadow-none border-blue-200/80 rounded-none bg-blue-50/50">
              <CardContent className="p-2">
                <div className="text-[10px] font-medium text-blue-800 mb-0.5">Сезонная заметка</div>
                <div className="text-[9px] text-blue-700">{recommendations.seasonal_note}</div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default RecommendedAnalyses;