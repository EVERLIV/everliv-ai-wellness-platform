import React from 'react';
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

const DiagnosticsDashboard: React.FC = () => {
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Начните с первой диагностики
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ЭКГ записи</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Загружено файлов ЭКГ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ИИ анализы</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Завершенных анализов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Рекомендации</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Персонализированных советов
            </p>
          </CardContent>
        </Card>
      </div>

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