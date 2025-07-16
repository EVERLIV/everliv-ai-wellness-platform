import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import { useAuth } from '@/contexts/AuthContext';
import ECGAnalysisResults from './ECGAnalysisResults';
import { 
  Heart, 
  Upload, 
  Info, 
  FileText,
  Activity,
  RefreshCw
} from 'lucide-react';

const ECGAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const { sessions, fetchSessions, fetchSessionDetails, isLoading } = useDiagnostics();
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user, fetchSessions]);

  const handleSessionSelect = async (sessionId: string) => {
    const sessionDetails = await fetchSessionDetails(sessionId);
    if (sessionDetails) {
      setSelectedSession(sessionDetails);
      setAnalyses(sessionDetails.ai_analyses || []);
    }
  };

  const ecgSessions = sessions.filter(session => 
    session.session_type === 'ecg' || 
    session.session_type === 'mixed'
  );

  const ecgAnalyses = analyses.filter(analysis => analysis.analysis_type === 'ecg');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            ЭКГ Анализ
          </h1>
          <p className="text-muted-foreground mt-1">
            Загрузите ЭКГ записи для детального анализа с помощью ИИ
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Новая функция
        </Badge>
      </div>

      {/* Info Alert */}
      {!user && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Для анализа ЭКГ необходимо войти в систему.
          </AlertDescription>
        </Alert>
      )}

      {user && ecgSessions.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            У вас пока нет загруженных ЭКГ. Перейдите на страницу загрузки файлов, чтобы добавить ЭКГ для анализа.
          </AlertDescription>
        </Alert>
      )}

      {/* ECG Sessions List */}
      {user && ecgSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ваши ЭКГ записи</CardTitle>
            <CardDescription>
              Выберите сессию для просмотра результатов анализа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ecgSessions.map((session) => (
                <div 
                  key={session.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSession?.id === session.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => handleSessionSelect(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{session.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Создано: {new Date(session.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {session.status}
                      </Badge>
                      {selectedSession?.id === session.id && isLoading && (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {ecgAnalyses.length > 0 && (
        <div className="space-y-6">
          {ecgAnalyses.map((analysis) => (
            <ECGAnalysisResults key={analysis.id} analysis={analysis} />
          ))}
        </div>
      )}

      {/* Upload Section */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Загрузка ЭКГ</CardTitle>
            <CardDescription>
              Поддерживаемые форматы: PDF, JPG, PNG. Максимальный размер файла: 50 МБ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Загрузите ЭКГ для анализа</h3>
              <p className="text-muted-foreground mb-4">
                Перейдите на страницу загрузки файлов, чтобы добавить новые ЭКГ записи
              </p>
              <Button asChild>
                <a href="/diagnostics/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Загрузить файлы
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Анализ ритма
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Автоматическое определение типа ритма, частоты сокращений и выявление аритмий
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Измерения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Автоматическое измерение интервалов PR, QRS, QT и других параметров
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Диагностика
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Выявление патологических изменений и рекомендации по дальнейшему обследованию
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Features */}
      <Card>
        <CardHeader>
          <CardTitle>Планируемые возможности</CardTitle>
          <CardDescription>
            Функции, которые будут добавлены в ближайшее время
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Real-time отображение ЭКГ</h4>
                <p className="text-sm text-muted-foreground">Интерактивная визуализация кривых</p>
              </div>
              <Badge variant="outline">В разработке</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Сравнение записей</h4>
                <p className="text-sm text-muted-foreground">Анализ динамики изменений</p>
              </div>
              <Badge variant="outline">Планируется</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Экспорт результатов</h4>
                <p className="text-sm text-muted-foreground">Печать и сохранение в PDF</p>
              </div>
              <Badge variant="outline">Планируется</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ECGAnalysisPage;