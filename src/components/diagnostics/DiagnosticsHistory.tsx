import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  History, 
  Search, 
  Filter,
  Calendar,
  FileText,
  Activity,
  Info
} from 'lucide-react';

const DiagnosticsHistory: React.FC = () => {
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
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Модуль истории диагностики находится в разработке. Здесь будет отображаться вся история ваших медицинских исследований.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры и поиск</CardTitle>
          <CardDescription>
            Найдите нужные диагностические сессии
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" disabled className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Поиск по названию
            </Button>
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

      {/* History List Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Ваши диагностические сессии</CardTitle>
          <CardDescription>
            Список всех проведенных диагностических исследований
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Пока нет диагностических сессий</h3>
            <p className="text-muted-foreground mb-6">
              Начните с загрузки медицинских файлов или создания новой сессии
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button disabled>
                <FileText className="h-4 w-4 mr-2" />
                Создать сессию
              </Button>
              <Button variant="outline" disabled>
                Загрузить файлы
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Всего сессий</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">0</div>
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
              <div className="text-3xl font-bold">0</div>
              <Badge variant="outline" className="mt-2">Новых сессий</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">ИИ анализы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">0</div>
              <Badge variant="outline" className="mt-2">Завершено</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

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