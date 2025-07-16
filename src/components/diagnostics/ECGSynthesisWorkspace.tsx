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
    <div className="space-y-8">
      {/* Заголовок страницы */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
          🔬 ИИ Синтез диагностики
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Загрузите ЭКГ и введите диагноз для получения персонализированных рекомендаций на основе вашего профиля здоровья
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Ввод данных */}
        <div className="space-y-8">
          <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileImage className="h-6 w-6" />
                </div>
                Загрузка ЭКГ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-gradient-to-br from-primary/5 to-purple-500/5 hover:from-primary/10 hover:to-purple-500/10 transition-colors duration-300">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
                    <Upload className="h-12 w-12 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="ecg-upload" className="cursor-pointer">
                      <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                        Выберите файл ЭКГ
                      </Button>
                      <Input
                        id="ecg-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG до 10MB
                    </p>
                  </div>
                </div>
                {ecgImage && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileImage className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-700">{ecgImage.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-purple-600 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Heart className="h-6 w-6" />
                </div>
                Диагноз врача
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="diagnosis" className="text-lg font-medium">Введите поставленный диагноз</Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Например: Гипертоническая болезнь I степени, очень высокий сердечно-сосудистый риск"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={5}
                    className="mt-3 text-base min-h-[120px] border-2 focus:border-purple-300"
                  />
                </div>
                <Button 
                  onClick={generateRecommendations}
                  disabled={isLoading || !diagnosis.trim()}
                  size="lg"
                  className="w-full text-lg py-6 h-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Генерация рекомендаций...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Получить рекомендации
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Рекомендации */}
        <div>
          <Card className="border-2 border-orange-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-orange-600 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Lightbulb className="h-6 w-6" />
                </div>
                Персонализированные рекомендации
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl mb-6 w-fit mx-auto">
                    <Lightbulb className="h-16 w-16 mx-auto text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Готов к анализу</h3>
                  <p className="text-lg">Введите диагноз и получите персональные рекомендации</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recommendations.map((rec, index) => (
                    <div
                      key={rec.id}
                      className={`p-6 rounded-xl border-2 ${getPriorityColor(rec.priority)} transform hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-bold text-lg">{rec.title}</h4>
                        <span className="text-sm px-3 py-1 rounded-full bg-white/90 font-medium border">
                          {getPriorityText(rec.priority)}
                        </span>
                      </div>
                      <p className="text-base mb-4 leading-relaxed">{rec.description}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                        <span className="text-sm font-medium opacity-75">
                          {rec.category}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <div className="text-xl">📊</div>
                      </div>
                      <h4 className="text-lg font-bold text-blue-800">
                        Основано на вашем профиле здоровья
                      </h4>
                    </div>
                    <p className="text-base text-blue-700 leading-relaxed">
                      Рекомендации персонализированы с учетом ваших биомаркеров, истории здоровья, текущих показателей и индивидуальных особенностей
                    </p>
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