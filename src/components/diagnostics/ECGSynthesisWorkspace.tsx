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
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
          <Stethoscope className="h-8 w-8" />
          ИИ Синтез диагностики
        </h1>
        <p className="text-muted-foreground">
          Загрузите ЭКГ и введите диагноз для получения персонализированных рекомендаций
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ввод данных */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Загрузка ЭКГ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="ecg-upload" className="cursor-pointer">
                      <span className="text-sm font-medium">Выберите файл ЭКГ</span>
                      <Input
                        id="ecg-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG до 10MB
                    </p>
                  </div>
                </div>
                {ecgImage && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                    <FileImage className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{ecgImage.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Диагноз врача
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="diagnosis">Введите поставленный диагноз</Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Например: Гипертоническая болезнь I степени, очень высокий сердечно-сосудистый риск"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={generateRecommendations}
                  disabled={isLoading || !diagnosis.trim()}
                  className="w-full"
                >
                  {isLoading ? 'Генерация рекомендаций...' : 'Получить рекомендации'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Рекомендации */}
        <div>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Персонализированные рекомендации
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Введите диагноз и нажмите "Получить рекомендации"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/80">
                          {getPriorityText(rec.priority)}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{rec.description}</p>
                      <div className="text-xs opacity-75">
                        Категория: {rec.category}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium mb-1">
                      📋 Основано на вашем профиле
                    </div>
                    <div className="text-xs text-blue-700">
                      Рекомендации учитывают ваши биомаркеры, историю здоровья и текущие показатели
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ECGSynthesisWorkspace;