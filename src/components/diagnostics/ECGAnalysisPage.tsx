import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Upload, 
  Info, 
  FileText,
  Activity
} from 'lucide-react';

const ECGAnalysisPage: React.FC = () => {
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
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Модуль ЭКГ анализа находится в разработке. Скоро здесь появится возможность загрузки и анализа электрокардиограмм.
        </AlertDescription>
      </Alert>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Загрузка ЭКГ</CardTitle>
          <CardDescription>
            Поддерживаемые форматы: PDF, JPG, PNG. Максимальный размер файла: 50 МБ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
            <div className="text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Перетащите файлы сюда</h3>
              <p className="text-muted-foreground mb-4">
                или нажмите для выбора файлов
              </p>
              <Button disabled>
                <Upload className="h-4 w-4 mr-2" />
                Выбрать файлы (скоро)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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