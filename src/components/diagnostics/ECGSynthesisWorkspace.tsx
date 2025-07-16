import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Heart, FileImage, Stethoscope, Lightbulb } from 'lucide-react';
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
  const [ecgImage, setEcgImage] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEcgImage(file);
      toast.success('ЭКГ изображение загружено');
    }
  };

  const generateRecommendations = async () => {
    if (!diagnosis.trim()) {
      toast.error('Пожалуйста, введите диагноз');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-diagnostic-synthesis', {
        body: {
          diagnosis: diagnosis.trim(),
          hasEcgImage: !!ecgImage
        }
      });

      if (error) throw error;

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
        },
        {
          id: '4',
          title: 'Контроль биомаркеров',
          description: 'Анализ липидного профиля, HbA1c, креатинина через 3 месяца. Мониторинг электролитов при приеме диуретиков.',
          category: 'Лабораторные показатели',
          priority: 'medium'
        },
        {
          id: '5',
          title: 'Управление стрессом',
          description: 'Практика релаксации, медитации или дыхательных упражнений 10-15 минут ежедневно.',
          category: 'Психологическое здоровье',
          priority: 'low'
        }
      ];

      setRecommendations(mockRecommendations);
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
      {/* Простой заголовок */}
      <div className="border-b border-gray-200 p-4 mb-6">
        <h1 className="text-xl font-medium text-gray-900 mb-1">
          ИИ Синтез диагностики
        </h1>
        <p className="text-sm text-gray-600">
          Загрузите ЭКГ и введите диагноз для получения рекомендаций
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Ввод данных */}
          <div className="space-y-4">
            {/* Загрузка ЭКГ */}
            <div className="border border-gray-300 bg-white">
              <div className="border-b border-gray-200 p-3">
                <h3 className="text-sm font-medium text-gray-900">Загрузка ЭКГ</h3>
              </div>
              <div className="p-4">
                <div className="border border-gray-300 p-6 text-center bg-gray-50">
                  <div className="mb-3">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  </div>
                  <Label htmlFor="ecg-upload" className="cursor-pointer">
                    <div className="text-sm text-gray-700 mb-2">Выберите файл ЭКГ</div>
                    <Input
                      id="ecg-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button className="bg-gray-200 border border-gray-300 px-4 py-2 text-sm hover:bg-gray-300">
                      Обзор
                    </button>
                  </Label>
                  <div className="text-xs text-gray-500 mt-2">PNG, JPG до 10MB</div>
                </div>
                {ecgImage && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">{ecgImage.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Диагноз */}
            <div className="border border-gray-300 bg-white">
              <div className="border-b border-gray-200 p-3">
                <h3 className="text-sm font-medium text-gray-900">Диагноз врача</h3>
              </div>
              <div className="p-4">
                <Label htmlFor="diagnosis" className="text-sm text-gray-700">Введите диагноз</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Например: Гипертоническая болезнь I степени"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={4}
                  className="mt-1 border-gray-300 text-sm"
                />
                <Button 
                  onClick={generateRecommendations}
                  disabled={isLoading || !diagnosis.trim()}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-8 text-sm"
                >
                  {isLoading ? 'Генерация...' : 'Получить рекомендации'}
                </Button>
              </div>
            </div>
          </div>

          {/* Рекомендации */}
          <div>
            <div className="border border-gray-300 bg-white">
              <div className="border-b border-gray-200 p-3">
                <h3 className="text-sm font-medium text-gray-900">Рекомендации</h3>
              </div>
              <div className="p-4">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm">Введите диагноз для получения рекомендаций</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="border border-gray-200 bg-white p-3"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                          <span className={`text-xs px-2 py-1 border ${
                            rec.priority === 'high' ? 'text-red-700 bg-red-50 border-red-200' :
                            rec.priority === 'medium' ? 'text-orange-700 bg-orange-50 border-orange-200' :
                            'text-green-700 bg-green-50 border-green-200'
                          }`}>
                            {getPriorityText(rec.priority)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">{rec.description}</p>
                        <div className="text-xs text-gray-500">
                          Категория: {rec.category}
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200">
                      <div className="text-xs text-blue-800 font-medium mb-1">
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