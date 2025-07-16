import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Upload, 
  FileText, 
  TrendingUp, 
  Clock,
  Plus,
  ArrowRight,
  Stethoscope,
  Brain,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const DiagnosticsDashboard: React.FC = () => {
  const { sessions, fetchSessions, isLoading } = useDiagnostics();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Calculate real statistics
  const stats = {
    totalSessions: sessions.length,
    ecgRecords: sessions.filter(s => s.session_type === 'ecg').length,
    completedAnalyses: sessions.filter(s => s.status === 'completed').length,
    thisMonthSessions: sessions.filter(session => {
      const sessionDate = new Date(session.created_at);
      const currentDate = new Date();
      return sessionDate.getMonth() === currentDate.getMonth() && 
             sessionDate.getFullYear() === currentDate.getFullYear();
    }).length
  };

  // Get recent sessions for quick access
  const recentSessions = sessions
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Добро пожаловать в модуль диагностики</CardTitle>
              <CardDescription className="text-base mt-2">
                Загружайте медицинские файлы, получайте ИИ-анализ и персонализированные рекомендации
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                ИИ-powered
              </Badge>
              <Badge variant="outline" className="text-xs">
                Бета-версия
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/diagnostics/upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Загрузить файлы
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/diagnostics/ecg" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                ЭКГ Анализ
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/diagnostics/history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                История
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего сессий</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisMonthSessions > 0 
                ? `+${stats.thisMonthSessions} в этом месяце` 
                : 'Начните с первой диагностики'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ЭКГ записи</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ecgRecords}</div>
            <p className="text-xs text-muted-foreground">
              Загружено файлов ЭКГ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAnalyses}</div>
            <p className="text-xs text-muted-foreground">
              Завершенных анализов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">За месяц</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthSessions}</div>
            <p className="text-xs text-muted-foreground">
              Новых сессий
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Недавние сессии</CardTitle>
                <CardDescription>
                  Ваши последние диагностические исследования
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/diagnostics/history">
                  Показать все
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {session.session_type === 'ecg' ? (
                      <Heart className="h-4 w-4 text-red-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-blue-500" />
                    )}
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.updated_at), 'dd MMMM, HH:mm', { locale: ru })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.status === 'completed' ? 'default' : 'outline'}>
                      {session.status === 'completed' ? 'Завершен' : 
                       session.status === 'in_progress' ? 'В процессе' : 'Черновик'}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/diagnostics/session/${session.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              ЭКГ Анализ
            </CardTitle>
            <CardDescription>
              Загружайте ЭКГ и получайте детальный анализ с ИИ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Поддерживаемые форматы</span>
                <Badge variant="outline">PDF, JPG, PNG</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ИИ-анализ</span>
                <Badge variant="secondary">Claude Sonnet 4</Badge>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/diagnostics/ecg" className="flex items-center gap-2">
                  Начать анализ ЭКГ
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Загрузка файлов
            </CardTitle>
            <CardDescription>
              Простая загрузка медицинских документов и изображений
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Максимальный размер</span>
                <Badge variant="outline">50 МБ</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Безопасность</span>
                <Badge variant="secondary">Шифрование</Badge>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/diagnostics/upload" className="flex items-center gap-2">
                  Загрузить файлы
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Как начать работу</CardTitle>
          <CardDescription>
            Следуйте этим простым шагам для эффективного использования модуля диагностики
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">1. Загрузите файлы</h3>
              <p className="text-sm text-muted-foreground">
                Загрузите ЭКГ, рентген или другие медицинские файлы
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">2. ИИ-анализ</h3>
              <p className="text-sm text-muted-foreground">
                Получите автоматический анализ с помощью ИИ
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">3. Рекомендации</h3>
              <p className="text-sm text-muted-foreground">
                Получите персонализированные рекомендации по здоровью
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticsDashboard;