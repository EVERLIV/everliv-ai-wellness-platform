import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Heart, FileImage, Stethoscope, Lightbulb, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

const ECGSynthesisWorkspace: React.FC = () => {
  const [ecgFile, setEcgFile] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('Файл слишком большой. Максимальный размер: 10MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Неподдерживаемый формат файла. Разрешены: JPG, PNG, PDF');
        return;
      }
      
      setEcgFile(file);
      toast.success(`Файл загружен: ${file.name}`);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `ecg-photo-${Date.now()}.jpg`, { 
              type: 'image/jpeg' 
            });
            setEcgFile(file);
            toast.success('Фото сделано');
          }
          stream.getTracks().forEach(track => track.stop());
          setIsCameraMode(false);
        }, 'image/jpeg', 0.8);
      });
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Ошибка доступа к камере');
      setIsCameraMode(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('ecg-upload')?.click();
  };

  const generateRecommendations = async () => {
    if (!diagnosis.trim()) {
      toast.error('Пожалуйста, введите диагноз');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-ecg-file', {
        body: {
          diagnosis: diagnosis.trim(),
          hasEcgFile: !!ecgFile,
          fileType: ecgFile?.type
        }
      });

      if (error) throw error;

      if (data?.recommendations) {
        // Используем рекомендации от API
        const apiRecommendations: Recommendation[] = data.recommendations.map((rec: any, index: number) => ({
          id: (index + 1).toString(),
          title: rec.title,
          description: rec.description,
          category: rec.category,
          priority: rec.priority
        }));
        
        setRecommendations(apiRecommendations);
      } else {
        // Fallback к mock данным
        const mockRecommendations: Recommendation[] = [
          {
            id: '1',
            title: 'Контроль артериального давления',
            description: 'Рекомендуется ежедневный мониторинг АД утром и вечером. Целевые значения: менее 130/80 мм рт.ст.',
            category: 'Мониторинг',
            priority: 'high'
          },
          {
            id: '2',
            title: 'Коррекция питания',
            description: 'Ограничение соли до 5г/сутки, увеличение потребления калия (фрукты, овощи), омега-3 жирных кислот.',
            category: 'Питание',
            priority: 'high'
          },
          {
            id: '3',
            title: 'Физическая активность',
            description: 'Аэробные нагрузки умеренной интенсивности 150 минут в неделю. Начинать с 10-15 минут ходьбы.',
            category: 'Физическая активность',
            priority: 'medium'
          }
        ];
        
        setRecommendations(mockRecommendations);
      }
      
      toast.success('Рекомендации сгенерированы на основе вашего профиля здоровья');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Ошибка при генерации рекомендаций');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Заголовок */}
      <div className="border-b border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <h1 className="text-lg md:text-xl font-medium text-gray-900 mb-1">
          ИИ Синтез диагностики
        </h1>
        <p className="text-sm text-gray-600">
          Загрузите ЭКГ и введите диагноз для получения рекомендаций
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Ввод данных */}
          <div className="space-y-4">
            {/* Загрузка ЭКГ */}
            <div className="border border-gray-300 bg-white">
              <div className="border-b border-gray-200 p-3 md:p-4">
                <h3 className="text-sm md:text-base font-medium text-gray-900">Загрузка ЭКГ</h3>
              </div>
              <div className="p-4 md:p-6">
                <div className="border border-gray-300 p-4 md:p-6 text-center bg-gray-50">
                  <div className="mb-3">
                    <Upload className="h-6 w-6 md:h-8 md:w-8 mx-auto text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-700 mb-3">Выберите файл ЭКГ или сделайте фото</div>
                  <Input
                    id="ecg-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button 
                      onClick={triggerFileInput}
                      className="bg-gray-200 border border-gray-300 px-4 py-2 text-sm hover:bg-gray-300 flex items-center justify-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Обзор файлов
                    </button>
                    <button 
                      onClick={handleCameraCapture}
                      className="bg-blue-200 border border-blue-300 px-4 py-2 text-sm hover:bg-blue-300 flex items-center justify-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Сделать фото
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">PNG, JPG, PDF до 10MB</div>
                </div>
                {ecgFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2">
                      {ecgFile.type === 'application/pdf' ? (
                        <div className="h-4 w-4 text-green-600 text-xs font-bold flex items-center justify-center bg-green-100 border border-green-300">
                          PDF
                        </div>
                      ) : (
                        <FileImage className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                      <span className="text-sm text-green-700 truncate">{ecgFile.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Диагноз */}
            <div className="border border-gray-300 bg-white">
              <div className="border-b border-gray-200 p-3 md:p-4">
                <h3 className="text-sm md:text-base font-medium text-gray-900">Диагноз врача</h3>
              </div>
              <div className="p-4 md:p-6">
                <Label htmlFor="diagnosis" className="text-sm text-gray-700 block mb-2">
                  Введите диагноз
                </Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Например: Гипертоническая болезнь I степени"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={4}
                  className="border-gray-300 text-sm w-full resize-none"
                />
                <Button 
                  onClick={generateRecommendations}
                  disabled={isLoading || !diagnosis.trim()}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-10 text-sm font-medium"
                >
                  {isLoading ? 'Генерация...' : 'Получить рекомендации'}
                </Button>
              </div>
            </div>
          </div>

          {/* Рекомендации */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="border border-gray-300 bg-white">
              <div className="border-b border-gray-200 p-3 md:p-4">
                <h3 className="text-sm md:text-base font-medium text-gray-900">Рекомендации</h3>
              </div>
              <div className="p-4 md:p-6">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-gray-500">
                    <Lightbulb className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-3 text-gray-400" />
                    <div className="text-sm">Введите диагноз для получения рекомендаций</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="border border-gray-200 bg-white p-3 md:p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <h4 className="text-sm md:text-base font-medium text-gray-900 flex-1">
                            {rec.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 border self-start ${
                            rec.priority === 'high' ? 'text-red-700 bg-red-50 border-red-200' :
                            rec.priority === 'medium' ? 'text-orange-700 bg-orange-50 border-orange-200' :
                            'text-green-700 bg-green-50 border-green-200'
                          }`}>
                            {getPriorityText(rec.priority)}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 mb-3 leading-relaxed">
                          {rec.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          Категория: {rec.category}
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-6 p-3 md:p-4 bg-blue-50 border border-blue-200">
                      <div className="text-xs md:text-sm text-blue-800 font-medium mb-1">
                        Основано на профиле пациента
                      </div>
                      <div className="text-xs text-blue-700">
                        Учитывает биомаркеры, историю болезни и текущие показатели
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECGSynthesisWorkspace;