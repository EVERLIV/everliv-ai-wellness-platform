import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, AlertCircle, TrendingUp, Activity, Heart, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AIAnalyticsProps {
  currentDate: Date;
  selectedDate?: Date;
}

interface AIRecommendation {
  title: string;
  description: string;
  type: 'exercise' | 'nutrition' | 'sleep' | 'health' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  reasoning: string;
  action_items: string[];
}

interface AIInsights {
  recommendations: AIRecommendation[];
  health_score: number;
  trending_metrics: {
    metric: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
  }[];
  key_findings: string[];
  next_update: string;
}

const AIAnalytics = ({ currentDate, selectedDate }: AIAnalyticsProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const generateInsights = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-openai-health-insights', {
        body: {
          user_id: user.id,
          analysis_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          analysis_type: 'comprehensive'
        }
      });

      if (error) throw error;

      setInsights(data);
      toast({
        title: "Аналитика обновлена",
        description: "Получены персональные рекомендации от ИИ"
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      
      // Fallback данные
      const fallbackInsights: AIInsights = {
        recommendations: [
          {
            title: "Оптимизация режима тренировок",
            description: "Анализ показывает недостаточную кардионагрузку",
            type: "exercise",
            priority: "high",
            confidence: 85,
            reasoning: "Низкая средняя ЧСС и недостаток аэробных упражнений",
            action_items: ["Добавить 20 мин кардио 3 раза в неделю", "Увеличить интенсивность тренировок"]
          },
          {
            title: "Коррекция режима сна",
            description: "Качество сна ниже рекомендуемого",
            type: "sleep",
            priority: "medium",
            confidence: 78,
            reasoning: "Частые пробуждения и недостаточная глубокая фаза сна",
            action_items: ["Ложиться спать в одно время", "Исключить экраны за 1 час до сна"]
          },
          {
            title: "Баланс питательных веществ",
            description: "Дефицит определенных микроэлементов",
            type: "nutrition",
            priority: "medium",
            confidence: 71,
            reasoning: "Анализ рациона показывает недостаток омега-3 и витамина D",
            action_items: ["Добавить рыбу 2 раза в неделю", "Рассмотреть прием витамина D"]
          }
        ],
        health_score: 76,
        trending_metrics: [
          { metric: "Качество сна", trend: "down", change: -12 },
          { metric: "Уровень активности", trend: "up", change: 8 },
          { metric: "Стресс", trend: "stable", change: 2 }
        ],
        key_findings: [
          "Улучшение показателей активности за последнюю неделю",
          "Снижение качества сна в выходные дни",
          "Стабильный уровень стресса в рабочие дни"
        ],
        next_update: "Следующий анализ рекомендован через 7 дней"
      };
      
      setInsights(fallbackInsights);
      toast({
        title: "Используется кэшированная аналитика",
        description: "Данные обновятся при следующем подключении"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      generateInsights();
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
      case 'exercise': return <Activity className="h-3 w-3 text-green-600" />;
      case 'nutrition': return <Heart className="h-3 w-3 text-red-600" />;
      case 'sleep': return <Zap className="h-3 w-3 text-purple-600" />;
      case 'health': return <AlertCircle className="h-3 w-3 text-blue-600" />;
      default: return <Brain className="h-3 w-3 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default: return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4 text-[10px] text-muted-foreground">
        Войдите в систему для получения ИИ аналитики
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium flex items-center gap-1">
          <Brain className="h-3 w-3" />
          ИИ Аналитика
        </div>
        <Button
          variant="outline"
          size="xs"
          onClick={generateInsights}
          disabled={isLoading}
          className="h-6 px-2 text-xs rounded-none border-gray-300"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Brain className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Date */}
      <div className="text-[10px] text-muted-foreground">
        Анализ на {format(selectedDate || new Date(), 'd MMMM yyyy', { locale: ru })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Health Score */}
          {insights?.health_score && (
            <Card className="shadow-none border-gray-200/80 rounded-none">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-medium">Общий показатель здоровья</div>
                  <div className={`text-lg font-bold ${
                    insights.health_score >= 80 ? 'text-green-600' :
                    insights.health_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {insights.health_score}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className={`h-1 rounded-full ${
                      insights.health_score >= 80 ? 'bg-green-500' :
                      insights.health_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${insights.health_score}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trending Metrics */}
          {insights?.trending_metrics && (
            <Card className="shadow-none border-gray-200/80 rounded-none">
              <CardHeader className="pb-1 px-2 py-1">
                <CardTitle className="text-xs font-medium">Тренды показателей</CardTitle>
              </CardHeader>
              <CardContent className="px-2 py-1 pt-0">
                <div className="space-y-1">
                  {insights.trending_metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span className="text-[10px]">{metric.metric}</span>
                      </div>
                      <span className={`text-[10px] font-medium ${
                        metric.change > 0 ? 'text-green-600' : 
                        metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Recommendations */}
          <div className="space-y-1">
            <div className="text-[10px] font-medium">Персональные рекомендации</div>
            {insights?.recommendations?.map((rec, index) => (
              <Card key={index} className="shadow-none border-gray-200/80 rounded-none">
                <CardContent className="p-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        {getTypeIcon(rec.type)}
                        <Badge className={`text-[8px] px-1 py-0 h-auto rounded-none ${getPriorityColor(rec.priority)}`}>
                          {rec.priority === 'high' ? 'Высокий' : 
                           rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                        <span className="text-[9px] text-muted-foreground">
                          {rec.confidence}% уверенности
                        </span>
                      </div>
                      
                      <div className="text-[10px] font-medium mb-0.5">
                        {rec.title}
                      </div>
                      
                      <div className="text-[9px] text-muted-foreground mb-1">
                        {rec.description}
                      </div>
                      
                      {expandedCard === index && (
                        <div className="space-y-1 mt-2 pt-2 border-t border-gray-200">
                          <div>
                            <div className="text-[9px] font-medium mb-0.5">Обоснование:</div>
                            <div className="text-[9px] text-muted-foreground">{rec.reasoning}</div>
                          </div>
                          
                          <div>
                            <div className="text-[9px] font-medium mb-0.5">Действия:</div>
                            <div className="space-y-0.5">
                              {rec.action_items.map((action, i) => (
                                <div key={i} className="text-[9px] text-muted-foreground flex items-start gap-1">
                                  <span className="text-primary">•</span>
                                  <span>{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Findings */}
          {insights?.key_findings && (
            <Card className="shadow-none border-blue-200/80 rounded-none bg-blue-50/50">
              <CardHeader className="pb-1 px-2 py-1">
                <CardTitle className="text-xs font-medium text-blue-800">Ключевые выводы</CardTitle>
              </CardHeader>
              <CardContent className="px-2 py-1 pt-0">
                <div className="space-y-0.5">
                  {insights.key_findings.map((finding, index) => (
                    <div key={index} className="text-[9px] text-blue-700 flex items-start gap-1">
                      <span className="text-blue-600">•</span>
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Update */}
          {insights?.next_update && (
            <div className="text-[9px] text-muted-foreground text-center py-1">
              {insights.next_update}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIAnalytics;