import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  History, 
  Search, 
  Filter,
  Calendar,
  FileText,
  Activity,
  Info,
  Heart,
  Brain,
  Trash2,
  Eye,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import type { DiagnosticSession } from '@/types/diagnostics';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

const DiagnosticsHistory: React.FC = () => {
  const { sessions, fetchSessions, deleteSession, isLoading } = useDiagnostics();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState<DiagnosticSession[]>([]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(
        sessions.filter(session => 
          session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [sessions, searchTerm]);

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'ecg':
        return <Heart className="h-4 w-4" />;
      case 'ultrasound':
        return <Activity className="h-4 w-4" />;
      case 'xray':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
        return <Badge variant="default">Завершен</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">В процессе</Badge>;
      case 'draft':
        return <Badge variant="outline">Черновик</Badge>;
      case 'archived':
        return <Badge variant="destructive">Архив</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDeleteSession = async (sessionId: string, sessionTitle: string) => {
    if (confirm(`Вы уверены, что хотите удалить сессию "${sessionTitle}"?`)) {
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const statsData = {
    total: sessions.length,
    thisMonth: sessions.filter(session => {
      const sessionDate = new Date(session.created_at);
      const currentDate = new Date();
      return sessionDate.getMonth() === currentDate.getMonth() && 
             sessionDate.getFullYear() === currentDate.getFullYear();
    }).length,
    completed: sessions.filter(session => session.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8 text-purple-500" />
            История диагностики
          </h1>
          <p className="text-muted-foreground mt-1">
            Просматривайте и управляйте вашими диагностическими сессиями
          </p>
        </div>
        <Button asChild>
          <Link to="/diagnostics/upload">
            <FileText className="h-4 w-4 mr-2" />
            Создать сессию
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Всего сессий</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">{statsData.total}</div>
              <Badge variant="outline" className="mt-2">За все время</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">За этот месяц</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">{statsData.thisMonth}</div>
              <Badge variant="outline" className="mt-2">Новых сессий</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Завершено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">{statsData.completed}</div>
              <Badge variant="outline" className="mt-2">Сессий</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Поиск и фильтры</CardTitle>
          <CardDescription>
            Найдите нужные диагностические сессии
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" disabled>
              <Calendar className="h-4 w-4 mr-2" />
              По дате
            </Button>
            <Button variant="outline" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Ваши диагностические сессии</CardTitle>
          <CardDescription>
            {filteredSessions.length > 0 
              ? `Найдено ${filteredSessions.length} сессий${searchTerm ? ` по запросу "${searchTerm}"` : ''}` 
              : 'Список всех проведенных диагностических исследований'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка сессий...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'Ничего не найдено' : 'Пока нет диагностических сессий'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? 'Попробуйте изменить поисковый запрос'
                  : 'Начните с загрузки медицинских файлов или создания новой сессии'
                }
              </p>
              {!searchTerm && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link to="/diagnostics/upload">
                      <FileText className="h-4 w-4 mr-2" />
                      Создать сессию
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/diagnostics/ecg">
                      Анализ ЭКГ
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getSessionTypeIcon(session.session_type)}
                          <h3 className="font-semibold text-lg">{session.title}</h3>
                        </div>
                        <Badge variant="outline">
                          {getSessionTypeName(session.session_type)}
                        </Badge>
                        {getStatusBadge(session.status)}
                      </div>
                      
                      {session.description && (
                        <p className="text-muted-foreground mb-3">{session.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Создано: {format(new Date(session.created_at), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                        </span>
                        <span>
                          Обновлено: {format(new Date(session.updated_at), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                        </span>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/diagnostics/session/${session.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Просмотреть
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <Download className="h-4 w-4 mr-2" />
                          Скачать отчет
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteSession(session.id, session.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coming Soon Features */}
      <Card>
        <CardHeader>
          <CardTitle>Планируемые возможности</CardTitle>
          <CardDescription>
            Функции, которые появятся в модуле истории
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Экспорт истории</h4>
                <p className="text-sm text-muted-foreground">Скачивание данных в различных форматах</p>
              </div>
              <Badge variant="outline">Планируется</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Аналитика трендов</h4>
                <p className="text-sm text-muted-foreground">Графики и статистика по здоровью</p>
              </div>
              <Badge variant="outline">В разработке</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Поделиться с врачом</h4>
                <p className="text-sm text-muted-foreground">Безопасная передача данных специалистам</p>
              </div>
              <Badge variant="outline">Планируется</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticsHistory;