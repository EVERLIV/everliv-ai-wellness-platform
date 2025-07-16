import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Heart,
  TrendingUp,
  Clock,
  Target,
  Pill,
  Activity,
  Eye,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Star
} from 'lucide-react';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SynthesisData {
  id: string;
  doctor_diagnosis: string;
  synthesis_type: 'confirming' | 'complementing' | 'questioning';
  confidence_score: number;
  ai_analysis: any;
  agreements: any[];
  discrepancies: any[];
  recommendations: any;
  follow_up_actions: any[];
  doctor_feedback: any;
  is_validated: boolean;
}

const DiagnosticsSynthesisWorkspace: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [doctorDiagnosis, setDoctorDiagnosis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [synthesis, setSynthesis] = useState<SynthesisData | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('input');
  const [session, setSession] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [ecgRecords, setEcgRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionId) {
      loadSessionData();
      loadExistingSynthesis();
    }
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      
      // Загружаем данные сессии
      const { data: sessionData, error: sessionError } = await supabase
        .from('diagnostic_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionData && !sessionError) {
        setSession(sessionData);
      }

      // Загружаем файлы
      const { data: filesData, error: filesError } = await supabase
        .from('diagnostic_files')
        .select('*')
        .eq('session_id', sessionId);

      if (filesData && !filesError) {
        setFiles(filesData);
      }

      // Загружаем ЭКГ записи
      const { data: ecgData, error: ecgError } = await supabase
        .from('ecg_records')
        .select('*')
        .eq('session_id', sessionId);

      if (ecgData && !ecgError) {
        setEcgRecords(ecgData);
      }

    } catch (error) {
      console.error('Ошибка загрузки данных сессии:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingSynthesis = async () => {
    try {
      const { data, error } = await supabase
        .from('diagnostic_synthesis')
        .select(`
          *,
          diagnosis_recommendations(*)
        `)
        .eq('session_id', sessionId)
        .single();

      if (data && !error) {
        setSynthesis(data);
        setRecommendations(data.diagnosis_recommendations || []);
        setDoctorDiagnosis(data.doctor_diagnosis);
        setActiveTab('analysis');
      }
    } catch (error) {
      console.log('Нет существующего синтеза для данной сессии');
    }
  };
  const handleSynthesis = async () => {
    if (!doctorDiagnosis.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите диагноз врача",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await supabase.functions.invoke('ai-diagnostic-synthesis', {
        body: {
          sessionId,
          doctorDiagnosis,
          patientData: {
            files,
            ecgRecords,
            session
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setSynthesis(response.data.synthesis);
      setRecommendations(response.data.detailed_recommendations || []);
      setActiveTab('analysis');

      toast({
        title: "Анализ завершен",
        description: "ИИ синтез диагноза готов",
      });

    } catch (error) {
      console.error('Ошибка синтеза:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить синтез диагноза",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSynthesisTypeInfo = (type: string) => {
    switch (type) {
      case 'confirming':
        return { 
          label: 'Подтверждающий анализ', 
          color: 'bg-green-500', 
          icon: CheckCircle,
          description: 'ИИ согласен с диагнозом врача'
        };
      case 'complementing':
        return { 
          label: 'Дополняющий анализ', 
          color: 'bg-blue-500', 
          icon: TrendingUp,
          description: 'ИИ дополняет диагноз новыми находками'
        };
      case 'questioning':
        return { 
          label: 'Вопросительный анализ', 
          color: 'bg-orange-500', 
          icon: AlertTriangle,
          description: 'ИИ видит несоответствия с данными'
        };
      default:
        return { 
          label: 'Анализ', 
          color: 'bg-gray-500', 
          icon: Brain,
          description: 'Анализ данных'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Левая панель - Данные пациента */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Данные пациента
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Файлы */}
                <div>
                  <h4 className="font-medium mb-2">Загруженные файлы ({files.length})</h4>
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm truncate">{file.file_name}</span>
                    </div>
                  ))}
                </div>

                {/* ЭКГ записи */}
                {ecgRecords.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">ЭКГ записи ({ecgRecords.length})</h4>
                    {ecgRecords.map((record) => (
                      <div key={record.id} className="flex items-center gap-2 p-2 border rounded">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div className="text-sm">
                          <div>ЧСС: {record.heart_rate || 'N/A'}</div>
                          <div>Ритм: {record.rhythm_type || 'Анализируется'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Информация о сессии */}
                <div>
                  <h4 className="font-medium mb-2">Сессия</h4>
                  <div className="text-sm space-y-1">
                    <div>Тип: {session?.session_type}</div>
                    <div>Статус: <Badge variant="outline">{session?.status}</Badge></div>
                    <div>Создано: {session?.created_at ? new Date(session.created_at).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
                
              </CardContent>
            </Card>
          </div>

          {/* Центральная панель */}
          <div className="lg:col-span-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="input">Ввод диагноза</TabsTrigger>
                <TabsTrigger value="analysis">ИИ Анализ</TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Диагноз врача
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Введите диагноз врача с указанием степени тяжести, функционального класса и сопутствующих состояний..."
                        value={doctorDiagnosis}
                        onChange={(e) => setDoctorDiagnosis(e.target.value)}
                        className="min-h-[200px]"
                      />
                      
                      <Button 
                        onClick={handleSynthesis}
                        disabled={isAnalyzing || !doctorDiagnosis.trim()}
                        className="w-full"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Анализирую...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Запустить ИИ синтез
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                {synthesis ? (
                  <>
                    {/* Заголовок анализа */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {React.createElement(getSynthesisTypeInfo(synthesis.synthesis_type).icon, { 
                              className: "h-5 w-5" 
                            })}
                            {getSynthesisTypeInfo(synthesis.synthesis_type).label}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getSynthesisTypeInfo(synthesis.synthesis_type).color}>
                              {synthesis.confidence_score.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getSynthesisTypeInfo(synthesis.synthesis_type).description}
                        </p>
                      </CardHeader>
                    </Card>

                    {/* Диагноз врача */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Диагноз врача</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm bg-muted p-3 rounded">{synthesis.doctor_diagnosis}</p>
                      </CardContent>
                    </Card>

                    {/* Согласия */}
                    {synthesis.agreements && synthesis.agreements.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            Согласия ИИ
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {synthesis.agreements.map((agreement: any, index: number) => (
                              <div key={index} className="border-l-4 border-green-500 pl-4">
                                <div className="font-medium text-sm">{agreement.point}</div>
                                <div className="text-xs text-muted-foreground mt-1">{agreement.evidence}</div>
                                <Badge variant="outline" className="mt-2 text-xs">
                                  Уверенность: {agreement.strength}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Расхождения */}
                    {synthesis.discrepancies && synthesis.discrepancies.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="h-5 w-5" />
                            Расхождения
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {synthesis.discrepancies.map((discrepancy: any, index: number) => (
                              <div key={index} className="border-l-4 border-orange-500 pl-4">
                                <div className="font-medium text-sm">{discrepancy.point}</div>
                                <div className="text-xs text-muted-foreground mt-1">{discrepancy.ai_perspective}</div>
                                <div className="text-xs mt-2">{discrepancy.suggestion}</div>
                                <Badge 
                                  variant={discrepancy.concern_level === 'high' ? 'destructive' : 'outline'} 
                                  className="mt-2 text-xs"
                                >
                                  {discrepancy.concern_level}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Анализ данных ИИ */}
                    {synthesis.ai_analysis && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            Анализ данных ИИ
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {synthesis.ai_analysis.ai_findings && (
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">Находки ИИ:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {synthesis.ai_analysis.ai_findings.map((finding: string, index: number) => (
                                  <li key={index} className="text-sm">{finding}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {synthesis.ai_analysis.risk_factors && (
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">Факторы риска:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {synthesis.ai_analysis.risk_factors.map((factor: string, index: number) => (
                                  <li key={index} className="text-sm">{factor}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                  </>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Введите диагноз врача для запуска ИИ анализа
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Правая панель - Рекомендации */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  ИИ Рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent>
                {synthesis && synthesis.recommendations ? (
                  <div className="space-y-4">
                    
                    {/* Немедленные действия */}
                    {synthesis.recommendations.immediate && synthesis.recommendations.immediate.length > 0 && (
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          Немедленно
                        </h4>
                        <ul className="space-y-1">
                          {synthesis.recommendations.immediate.map((item: string, index: number) => (
                            <li key={index} className="text-sm bg-red-50 p-2 rounded border-l-2 border-red-500">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Мониторинг */}
                    {synthesis.recommendations.monitoring && synthesis.recommendations.monitoring.length > 0 && (
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          Мониторинг
                        </h4>
                        <ul className="space-y-1">
                          {synthesis.recommendations.monitoring.map((item: string, index: number) => (
                            <li key={index} className="text-sm bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Исследования */}
                    {synthesis.recommendations.investigations && synthesis.recommendations.investigations.length > 0 && (
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-purple-500" />
                          Исследования
                        </h4>
                        <ul className="space-y-1">
                          {synthesis.recommendations.investigations.map((item: string, index: number) => (
                            <li key={index} className="text-sm bg-purple-50 p-2 rounded border-l-2 border-purple-500">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Образ жизни */}
                    {synthesis.recommendations.lifestyle && synthesis.recommendations.lifestyle.length > 0 && (
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Heart className="h-4 w-4 text-green-500" />
                          Образ жизни
                        </h4>
                        <ul className="space-y-1">
                          {synthesis.recommendations.lifestyle.map((item: string, index: number) => (
                            <li key={index} className="text-sm bg-green-50 p-2 rounded border-l-2 border-green-500">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Рекомендации появятся после анализа
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DiagnosticsSynthesisWorkspace;