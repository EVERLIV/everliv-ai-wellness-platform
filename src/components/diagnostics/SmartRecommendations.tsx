import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Heart,
  Activity,
  Pill,
  Stethoscope,
  User,
  Calendar,
  Eye,
  EyeOff,
  RefreshCw,
  FileText,
  Target,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface SmartRecommendation {
  id?: string;
  title: string;
  description: string;
  type: 'medication' | 'lifestyle' | 'monitoring' | 'procedure' | 'referral';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  reasoning?: string;
  implementation_steps?: string[];
  contraindications?: string;
  expected_outcome?: string;
  monitoring_schedule?: string;
  ai_generated: boolean;
  doctor_approved?: boolean | null;
  implementation_status: 'pending' | 'started' | 'completed' | 'declined';
  created_at?: string;
}

interface MedicalAlert {
  type: 'warning' | 'info' | 'critical';
  message: string;
  action_required: string;
}

interface SmartRecommendationsProps {
  sessionId?: string;
  className?: string;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ 
  sessionId, 
  className 
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [medicalAlerts, setMedicalAlerts] = useState<MedicalAlert[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  // Load existing recommendations
  useEffect(() => {
    if (user && sessionId) {
      loadRecommendations();
    }
  }, [user, sessionId]);

  const loadRecommendations = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('diagnostic_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      setRecommendations(data || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить рекомендации",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartRecommendations = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-smart-recommendations', {
        body: {
          userId: user.id,
          sessionId: sessionId,
          includeProfile: true,
          includeBiomarkers: true
        }
      });

      if (error) throw error;

      if (data.success) {
        setMedicalAlerts(data.medical_alerts || []);
        setSummary(data.summary || '');
        setLastGenerated(new Date().toISOString());
        
        toast({
          title: "Рекомендации сгенерированы",
          description: `Создано ${data.total_recommendations} персонализированных рекомендаций`,
        });

        // Reload recommendations from database
        await loadRecommendations();
      } else {
        throw new Error(data.error || 'Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Ошибка генерации",
        description: "Не удалось сгенерировать рекомендации. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateRecommendationStatus = async (
    recommendationId: string, 
    status: 'started' | 'completed' | 'declined'
  ) => {
    try {
      const { error } = await supabase
        .from('diagnostic_recommendations')
        .update({ implementation_status: status })
        .eq('id', recommendationId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, implementation_status: status }
            : rec
        )
      );

      toast({
        title: "Статус обновлен",
        description: `Рекомендация отмечена как "${
          status === 'started' ? 'начата' : 
          status === 'completed' ? 'выполнена' : 'отклонена'
        }"`,
      });
    } catch (error) {
      console.error('Error updating recommendation status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус рекомендации",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="h-4 w-4" />;
      case 'lifestyle':
        return <Heart className="h-4 w-4" />;
      case 'monitoring':
        return <Activity className="h-4 w-4" />;
      case 'procedure':
        return <Stethoscope className="h-4 w-4" />;
      case 'referral':
        return <User className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'medication':
        return 'Лечение';
      case 'lifestyle':
        return 'Образ жизни';
      case 'monitoring':
        return 'Мониторинг';
      case 'procedure':
        return 'Процедуры';
      case 'referral':
        return 'Консультация';
      default:
        return 'Общие';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Срочно';
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'started':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'declined':
        return <EyeOff className="h-4 w-4 text-gray-500" />;
      default:
        return <Eye className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Умные рекомендации
              </CardTitle>
              <CardDescription>
                Персонализированные медицинские рекомендации на основе ИИ-анализа
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                GPT-4.1
              </Badge>
              <Button 
                onClick={generateSmartRecommendations} 
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                {isGenerating ? 'Генерация...' : 'Сгенерировать'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {summary && (
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Общая оценка:</strong> {summary}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* Medical Alerts */}
      {medicalAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Медицинские уведомления
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicalAlerts.map((alert, index) => (
              <Alert key={index} variant={alert.type === 'critical' ? 'destructive' : 'default'}>
                {getAlertIcon(alert.type)}
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Действие:</strong> {alert.action_required}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Загрузка рекомендаций...</p>
            </div>
          </CardContent>
        </Card>
      ) : recommendations.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Пока нет персонализированных рекомендаций</h3>
              <p className="text-muted-foreground mb-6">
                Нажмите "Сгенерировать", чтобы получить умные рекомендации на основе ваших медицинских данных
              </p>
              <Button onClick={generateSmartRecommendations} disabled={isGenerating}>
                <Brain className="h-4 w-4 mr-2" />
                Сгенерировать рекомендации
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Metadata */}
          {lastGenerated && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Найдено {recommendations.length} рекомендаций</span>
              <span>
                Последнее обновление: {format(new Date(lastGenerated), 'dd MMMM, HH:mm', { locale: ru })}
              </span>
            </div>
          )}

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendations.map((recommendation) => (
              <Card 
                key={recommendation.id} 
                className={`transition-all duration-200 ${
                  recommendation.priority === 'urgent' ? 'border-red-200 bg-red-50/50' :
                  recommendation.priority === 'high' ? 'border-orange-200 bg-orange-50/50' :
                  'hover:shadow-md'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(recommendation.type)}
                      <CardTitle className="text-base">{recommendation.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(recommendation.implementation_status)}
                      <Badge variant={getPriorityColor(recommendation.priority)} className="text-xs">
                        {getPriorityName(recommendation.priority)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {getTypeName(recommendation.type)}
                    </Badge>
                    <span>•</span>
                    <span>{recommendation.category}</span>
                    {recommendation.ai_generated && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          ИИ
                        </Badge>
                      </>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm">{recommendation.description}</p>

                  {/* Expandable details */}
                  {(recommendation.reasoning || recommendation.implementation_steps) && (
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedCard(
                          expandedCard === recommendation.id ? null : recommendation.id!
                        )}
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                      >
                        {expandedCard === recommendation.id ? 'Скрыть детали' : 'Показать детали'}
                      </Button>

                      {expandedCard === recommendation.id && (
                        <div className="mt-3 space-y-3 text-xs">
                          {recommendation.reasoning && (
                            <div>
                              <h5 className="font-medium mb-1">Медицинское обоснование:</h5>
                              <p className="text-muted-foreground">{recommendation.reasoning}</p>
                            </div>
                          )}

                          {recommendation.implementation_steps && (
                            <div>
                              <h5 className="font-medium mb-1">Шаги выполнения:</h5>
                              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {recommendation.implementation_steps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {recommendation.expected_outcome && (
                            <div>
                              <h5 className="font-medium mb-1">Ожидаемый результат:</h5>
                              <p className="text-muted-foreground">{recommendation.expected_outcome}</p>
                            </div>
                          )}

                          {recommendation.contraindications && (
                            <div>
                              <h5 className="font-medium mb-1 text-red-600">Противопоказания:</h5>
                              <p className="text-red-600">{recommendation.contraindications}</p>
                            </div>
                          )}

                          {recommendation.monitoring_schedule && (
                            <div>
                              <h5 className="font-medium mb-1">График мониторинга:</h5>
                              <p className="text-muted-foreground">{recommendation.monitoring_schedule}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Action buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {recommendation.created_at && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(recommendation.created_at), 'dd.MM.yyyy', { locale: ru })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {recommendation.implementation_status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRecommendationStatus(recommendation.id!, 'started')}
                            className="h-7 text-xs"
                          >
                            Начать
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRecommendationStatus(recommendation.id!, 'declined')}
                            className="h-7 text-xs"
                          >
                            Отклонить
                          </Button>
                        </>
                      )}
                      
                      {recommendation.implementation_status === 'started' && (
                        <Button
                          size="sm"
                          onClick={() => updateRecommendationStatus(recommendation.id!, 'completed')}
                          className="h-7 text-xs"
                        >
                          Завершить
                        </Button>
                      )}
                      
                      {recommendation.implementation_status === 'completed' && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Выполнено
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Medical disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Медицинское предупреждение:</strong> Данные рекомендации созданы ИИ и носят информационный характер. 
          Всегда консультируйтесь с квалифицированным врачом перед принятием медицинских решений. 
          При серьезных симптомах немедленно обратитесь к специалисту.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SmartRecommendations;