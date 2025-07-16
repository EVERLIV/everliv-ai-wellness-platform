import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Upload, 
  FileText, 
  Image, 
  File,
  Info,
  Shield,
  Check,
  X,
  Loader2
} from 'lucide-react';

const FileUploadPage: React.FC = () => {
  const { user } = useAuth();
  const { createSession, uploadFile, startAIAnalysis, isLoading } = useDiagnostics();
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = async (files: FileList) => {
    if (!user) return;

    // Create session if none exists
    let sessionId = currentSession?.id;
    if (!sessionId) {
      const session = await createSession({
        title: 'Загрузка файлов',
        description: 'Сессия для загруженных медицинских файлов',
        session_type: 'mixed'
      });
      sessionId = session.id;
      setCurrentSession(session);
    }

    // Upload files
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        setUploadProgress(25);
        const fileRecord = await uploadFile(file, sessionId);
        setUploadProgress(75);
        
        // Start AI analysis for supported file types
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
          await startAIAnalysis(sessionId, fileRecord.file_url, 'ecg');
        }
        
        setUploadProgress(100);
        return { ...fileRecord, status: 'completed' };
      } catch (error) {
        return { name: file.name, status: 'error', error: error.message };
      }
    });

    const results = await Promise.all(uploadPromises);
    setUploadedFiles(prev => [...prev, ...results]);
    setUploadProgress(0);
  };

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFiles(e.target.files);
    }
  }, []);

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
      {!user && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Для загрузки файлов необходимо войти в систему.
          </AlertDescription>
        </Alert>
      )}

      {user && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Загружайте медицинские файлы для автоматического ИИ-анализа. Поддерживаются PDF, JPG, PNG форматы.
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Zone */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Быстрая загрузка</CardTitle>
            <CardDescription>
              Перетащите файлы в область ниже или нажмите для выбора
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className={`border-2 border-dashed rounded-lg p-12 transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className={`h-16 w-16 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="text-xl font-medium mb-2">
                  {dragActive ? 'Отпустите файлы здесь' : 'Перетащите файлы сюда'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Поддерживаются PDF, изображения (JPG, PNG) и другие медицинские форматы
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button disabled={isLoading} size="lg" asChild>
                    <label className="cursor-pointer">
                      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      {isLoading ? 'Загрузка...' : 'Выбрать файлы'}
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                  </Button>
                  <Button variant="outline" disabled={isLoading} size="lg" asChild>
                    <label className="cursor-pointer">
                      <Image className="h-4 w-4 mr-2" />
                      Только изображения
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Загрузка файлов...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Загруженные файлы</CardTitle>
            <CardDescription>
              Файлы в текущей сессии и статус их обработки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{file.name || file.file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.file_size ? `${Math.round(file.file_size / 1024)} KB` : 'Неизвестный размер'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'completed' && (
                      <>
                        <Badge variant="default" className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Загружен
                        </Badge>
                        <Badge variant="secondary">ИИ анализ запущен</Badge>
                      </>
                    )}
                    {file.status === 'error' && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <X className="h-3 w-3" />
                        Ошибка
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Upload History */}
      {user && uploadedFiles.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>История загрузок</CardTitle>
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
      )}
    </div>
  );
};

export default FileUploadPage;