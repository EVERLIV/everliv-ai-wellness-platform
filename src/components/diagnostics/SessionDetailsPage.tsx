import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  FileText, 
  Heart, 
  Brain, 
  Download,
  Calendar,
  User,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import type { DiagnosticSessionWithDetails } from '@/types/diagnostics';
import ECGAnalysisResults from './ECGAnalysisResults';
import SmartRecommendations from './SmartRecommendations';

const SessionDetailsPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { fetchSessionDetails, isLoading } = useDiagnostics();
  const [session, setSession] = useState<DiagnosticSessionWithDetails | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails(sessionId).then(setSession);
    }
  }, [sessionId, fetchSessionDetails]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Сессия не найдена или у вас нет доступа к ней.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link to="/diagnostics/history">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться к истории
          </Link>
        </Button>
      </div>
    );
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'ecg':
        return <Heart className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getSessionTypeName = (type: string) => {
    switch (type) {
      case 'ecg':
        return 'ЭКГ';
      case 'ultrasound':
        return 'УЗИ';
      case 'xray':
        return 'Рентген';
      case 'blood_test':
        return 'Анализ крови';
      case 'mixed':
        return 'Смешанный';
      default:
        return 'Другой';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Завершен
        </Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          В процессе
        </Badge>;
      case 'draft':
        return <Badge variant="outline">Черновик</Badge>;
      case 'archived':
        return <Badge variant="destructive">Архив</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/diagnostics/history">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {getSessionTypeIcon(session.session_type)}
              {session.title}
            </h1>
            <p className="text-muted-foreground">
              {getSessionTypeName(session.session_type)} • {format(new Date(session.created_at), 'dd MMMM yyyy', { locale: ru })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(session.status)}
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Скачать отчет
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о сессии</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {session.description && (
                  <div>
                    <h4 className="font-medium mb-2">Описание</h4>
                    <p className="text-muted-foreground">{session.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Создано</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.created_at), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Обновлено</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.updated_at), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files */}
          {session.files && session.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Загруженные файлы</CardTitle>
                <CardDescription>
                  Файлы, связанные с этой диагностической сессией
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{file.file_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.file_type} • {file.file_size ? `${Math.round(file.file_size / 1024)} KB` : 'Неизвестный размер'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={file.upload_status === 'uploaded' ? 'default' : 'outline'}>
                          {file.upload_status === 'uploaded' ? 'Загружен' : file.upload_status}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis Results */}
          {session.ai_analyses && session.ai_analyses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  ИИ-анализ
                </CardTitle>
                <CardDescription>
                  Результаты автоматического анализа медицинских данных
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {session.ai_analyses.map((analysis) => (
                    <div key={analysis.id}>
                      {analysis.analysis_type === 'ecg' && analysis.ai_findings && (
                        <ECGAnalysisResults 
                          analysis={analysis}
                        />
                      )}
                      {analysis.analysis_type !== 'ecg' && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline">{analysis.analysis_type.toUpperCase()}</Badge>
                            <Badge variant={analysis.analysis_status === 'completed' ? 'default' : 'secondary'}>
                              {analysis.analysis_status === 'completed' ? 'Завершен' : 'В процессе'}
                            </Badge>
                          </div>
                          {analysis.ai_findings && (
                            <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                              {JSON.stringify(analysis.ai_findings, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Smart Recommendations */}
          <SmartRecommendations sessionId={session.id} />

          {/* Recommendations */}
          {session.recommendations && session.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Базовые рекомендации</CardTitle>
                <CardDescription>
                  Стандартные рекомендации на основе анализа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{recommendation.title}</h4>
                        <Badge variant={recommendation.priority === 'high' ? 'destructive' : 
                                      recommendation.priority === 'medium' ? 'default' : 'outline'}>
                          {recommendation.priority === 'high' ? 'Высокий' :
                           recommendation.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {recommendation.recommendation_type}
                        </Badge>
                        {recommendation.ai_generated && (
                          <Badge variant="secondary" className="text-xs">
                            <Brain className="h-3 w-3 mr-1" />
                            ИИ
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" disabled>
                <Download className="h-4 w-4 mr-2" />
                Скачать отчет
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Поделиться с врачом
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/diagnostics/upload">
                  <FileText className="h-4 w-4 mr-2" />
                  Создать новую сессию
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика сессии</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Файлов загружено</span>
                <Badge variant="outline">{session.files?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ИИ-анализов</span>
                <Badge variant="outline">{session.ai_analyses?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Рекомендаций</span>
                <Badge variant="outline">{session.recommendations?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ЭКГ записей</span>
                <Badge variant="outline">{session.ecg_records?.length || 0}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsPage;