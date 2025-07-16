import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Image, 
  File,
  Info,
  Shield
} from 'lucide-react';

const FileUploadPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Upload className="h-8 w-8 text-blue-500" />
            Загрузка файлов
          </h1>
          <p className="text-muted-foreground mt-1">
            Загружайте медицинские документы для анализа и хранения
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Модуль загрузки файлов находится в разработке. Скоро здесь появится возможность безопасной загрузки медицинских документов.
        </AlertDescription>
      </Alert>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрая загрузка</CardTitle>
          <CardDescription>
            Перетащите файлы в область ниже или нажмите для выбора
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
            <div className="text-center">
              <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Перетащите файлы сюда</h3>
              <p className="text-muted-foreground mb-6">
                Поддерживаются PDF, изображения (JPG, PNG) и другие медицинские форматы
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button disabled size="lg">
                  <Upload className="h-4 w-4 mr-2" />
                  Выбрать файлы (скоро)
                </Button>
                <Button variant="outline" disabled size="lg">
                  <Image className="h-4 w-4 mr-2" />
                  Только изображения
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported Formats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" />
              PDF документы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Медицинские заключения, результаты анализов, выписки
            </p>
            <Badge variant="outline">До 50 МБ</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-green-500" />
              Изображения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              ЭКГ, рентген снимки, УЗИ изображения
            </p>
            <Badge variant="outline">JPG, PNG</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5 text-blue-500" />
              Другие форматы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              DICOM файлы, текстовые документы
            </p>
            <Badge variant="outline">Планируется</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Безопасность и конфиденциальность
          </CardTitle>
          <CardDescription>
            Ваши медицинские данные защищены современными технологиями
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Шифрование данных</h4>
                <p className="text-sm text-muted-foreground">AES-256 шифрование</p>
              </div>
              <Badge variant="secondary">Активно</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Контроль доступа</h4>
                <p className="text-sm text-muted-foreground">Только вы видите свои файлы</p>
              </div>
              <Badge variant="secondary">Защищено</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Резервное копирование</h4>
                <p className="text-sm text-muted-foreground">Автоматические бэкапы</p>
              </div>
              <Badge variant="secondary">Включено</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Аудит действий</h4>
                <p className="text-sm text-muted-foreground">Лог всех операций</p>
              </div>
              <Badge variant="secondary">Отслеживается</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload History Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Последние загрузки</CardTitle>
          <CardDescription>
            Здесь будет отображаться история ваших загрузок
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Пока нет загруженных файлов
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploadPage;