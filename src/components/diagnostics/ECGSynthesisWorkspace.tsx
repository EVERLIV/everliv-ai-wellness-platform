import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Heart, FileImage, Stethoscope, Lightbulb, Camera, ChevronRight, Download, BookOpen, TrendingUp, Activity } from 'lucide-react';
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
  const [prognosis, setPrognosis] = useState<any>(null);
  const [educationalContent, setEducationalContent] = useState<any>(null);
  const [exportData, setExportData] = useState<any>(null);
  const [ecgAnalysis, setEcgAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzingEcg, setIsAnalyzingEcg] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'prognosis' | 'education' | 'export' | 'ecg-analysis'>('recommendations');

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

      console.log('Ответ от функции:', data);

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
        
        // Устанавливаем дополнительные данные если они есть
        if (data.prognosis) {
          setPrognosis(data.prognosis);
        }
        if (data.educationalContent) {
          setEducationalContent(data.educationalContent);
        }
        if (data.exportData) {
          setExportData(data.exportData);
        }
        
        toast.success('Анализ завершен успешно');
      } else {
        toast.error('Не удалось получить рекомендации');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Ошибка при генерации рекомендаций');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeEcgWithAI = async () => {
    if (!ecgFile) {
      toast.error('Пожалуйста, загрузите файл ЭКГ');
      return;
    }

    if (!diagnosis.trim()) {
      toast.error('Пожалуйста, введите диагноз для сравнения');
      return;
    }

    setIsAnalyzingEcg(true);
    try {
      // Конвертируем файл в base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(ecgFile);
      });

      const { data, error } = await supabase.functions.invoke('analyze-ecg-with-openai', {
        body: {
          ecgImage: base64Image,
          diagnosis: diagnosis.trim()
        }
      });

      if (error) throw error;

      if (data?.success && data.analysis) {
        setEcgAnalysis(data.analysis);
        setActiveTab('ecg-analysis');
        toast.success('Анализ ЭКГ завершен успешно');
      } else {
        toast.error('Не удалось проанализировать ЭКГ');
      }
    } catch (error) {
      console.error('Error analyzing ECG:', error);
      toast.error('Ошибка при анализе ЭКГ');
    } finally {
      setIsAnalyzingEcg(false);
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
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button 
                    onClick={generateRecommendations}
                    disabled={isLoading || !diagnosis.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0 h-10 text-sm font-medium"
                  >
                    {isLoading ? 'Генерация...' : 'Получить рекомендации'}
                  </Button>
                  <Button 
                    onClick={analyzeEcgWithAI}
                    disabled={isAnalyzingEcg || !ecgFile || !diagnosis.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0 h-10 text-sm font-medium"
                  >
                    {isAnalyzingEcg ? 'Анализ ЭКГ...' : 'Анализ ЭКГ с ИИ'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Результаты анализа */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="border border-gray-300 bg-white">
              {/* Вкладки навигации */}
              {(recommendations.length > 0 || prognosis || educationalContent || exportData || ecgAnalysis) && (
                <div className="border-b border-gray-200">
                  <div className="flex flex-wrap">
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className={`px-4 py-2 text-xs md:text-sm font-medium border-b-2 flex items-center gap-1 ${
                        activeTab === 'recommendations' 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Lightbulb className="h-4 w-4" />
                      Рекомендации
                    </button>
                    {ecgAnalysis && (
                      <button
                        onClick={() => setActiveTab('ecg-analysis')}
                        className={`px-4 py-2 text-xs md:text-sm font-medium border-b-2 flex items-center gap-1 ${
                          activeTab === 'ecg-analysis' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Activity className="h-4 w-4" />
                        Анализ ЭКГ
                      </button>
                    )}
                    {prognosis && (
                      <button
                        onClick={() => setActiveTab('prognosis')}
                        className={`px-4 py-2 text-xs md:text-sm font-medium border-b-2 flex items-center gap-1 ${
                          activeTab === 'prognosis' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <TrendingUp className="h-4 w-4" />
                        Прогноз
                      </button>
                    )}
                    {educationalContent && (
                      <button
                        onClick={() => setActiveTab('education')}
                        className={`px-4 py-2 text-xs md:text-sm font-medium border-b-2 flex items-center gap-1 ${
                          activeTab === 'education' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <BookOpen className="h-4 w-4" />
                        Обучение
                      </button>
                    )}
                    {exportData && (
                      <button
                        onClick={() => setActiveTab('export')}
                        className={`px-4 py-2 text-xs md:text-sm font-medium border-b-2 flex items-center gap-1 ${
                          activeTab === 'export' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Download className="h-4 w-4" />
                        Экспорт
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 md:p-6">
                {/* Вкладка Рекомендации */}
                {activeTab === 'recommendations' && (
                  <>
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
                  </>
                )}

                {/* Вкладка Анализ ЭКГ */}
                {activeTab === 'ecg-analysis' && ecgAnalysis && (
                  <div className="space-y-6">
                    {/* Основной анализ ЭКГ */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Анализ ЭКГ</h4>
                      <div className="border border-gray-200 p-4 bg-gray-50">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {ecgAnalysis.ecgAnalysis}
                        </p>
                      </div>
                    </div>

                    {/* Выявленные патологии */}
                    {ecgAnalysis.detectedAbnormalities && ecgAnalysis.detectedAbnormalities.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Выявленные патологии</h4>
                        <div className="space-y-2">
                          {ecgAnalysis.detectedAbnormalities.map((abnormality: string, index: number) => (
                            <div key={index} className="border border-red-200 p-3 bg-red-50">
                              <p className="text-sm text-red-700">{abnormality}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Сравнение с диагнозом */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Сравнение с диагнозом врача</h4>
                      <div className="border border-gray-200 p-4">
                        <p className="text-sm text-gray-700 mb-3">{ecgAnalysis.diagnosisComparison}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">Уровень согласованности:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-2 rounded-full ${
                                  ecgAnalysis.agreementLevel >= 80 ? 'bg-green-500' :
                                  ecgAnalysis.agreementLevel >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${ecgAnalysis.agreementLevel}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{ecgAnalysis.agreementLevel}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Дополнительные рекомендации */}
                    {ecgAnalysis.additionalRecommendations && ecgAnalysis.additionalRecommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Дополнительные рекомендации</h4>
                        <div className="space-y-2">
                          {ecgAnalysis.additionalRecommendations.map((recommendation: string, index: number) => (
                            <div key={index} className="border border-blue-200 p-3 bg-blue-50">
                              <p className="text-sm text-blue-700">{recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Уровень уверенности */}
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Уровень уверенности ИИ:</span>
                        <span className="text-sm font-medium text-gray-700">{ecgAnalysis.confidence}%</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        Анализ основан на изображении ЭКГ и может требовать дополнительной медицинской оценки
                      </div>
                    </div>
                  </div>
                )}

                {/* Вкладка Прогноз */}
                {activeTab === 'prognosis' && prognosis && (
                  <div className="space-y-6">
                    {/* Сценарии развития */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Вероятные сценарии</h4>
                      <div className="space-y-3">
                        {prognosis.scenarios?.map((scenario: any, index: number) => (
                          <div key={index} className="border border-gray-200 p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-sm">{scenario.scenario}</span>
                              <span className="text-xs bg-gray-100 px-2 py-1">{scenario.probability}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
                            <p className="text-xs text-gray-500">Условия: {scenario.conditions}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Факторы влияния */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Факторы влияния</h4>
                      <div className="space-y-2">
                        {prognosis.influencingFactors?.map((factor: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50">
                            <span className="text-xs font-medium">{factor.factor}</span>
                            <span className={`text-xs px-2 py-1 ${
                              factor.impact === 'Высокий' || factor.impact === 'Негативный' ? 'bg-red-100 text-red-700' :
                              factor.impact === 'Средний' ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {factor.impact}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Временные рамки */}
                    {prognosis.timeframes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Временные рамки</h4>
                        <div className="space-y-2">
                          {Object.entries(prognosis.timeframes).map(([period, description]: any) => (
                            <div key={period} className="p-2 border border-gray-200">
                              <p className="text-xs text-gray-600">{description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Превентивные меры */}
                    {prognosis.preventiveMeasures?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Превентивные меры</h4>
                        <ul className="space-y-1">
                          {prognosis.preventiveMeasures.map((measure: string, index: number) => (
                            <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 mt-0.5 text-gray-400 flex-shrink-0" />
                              {measure}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Вкладка Обучение */}
                {activeTab === 'education' && educationalContent && (
                  <div className="space-y-6">
                    {/* Почему ИИ рекомендует */}
                    {educationalContent.whyAiRecommends?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Почему ИИ предлагает именно это?</h4>
                        <div className="space-y-3">
                          {educationalContent.whyAiRecommends.map((item: any, index: number) => (
                            <div key={index} className="border border-gray-200 p-3">
                              <div className="font-medium text-xs mb-2">{item.recommendation}</div>
                              <p className="text-xs text-gray-600 mb-2">{item.reasoning}</p>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1">{item.evidenceLevel}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Клинические исследования */}
                    {educationalContent.clinicalStudies?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Клинические исследования</h4>
                        <div className="space-y-3">
                          {educationalContent.clinicalStudies.map((study: any, index: number) => (
                            <div key={index} className="border border-gray-200 p-3">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-xs">{study.title}</span>
                                <span className="text-xs text-gray-500">{study.year}</span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{study.summary}</p>
                              {study.link && (
                                <a href={study.link} target="_blank" rel="noopener noreferrer" 
                                   className="text-xs text-blue-600 hover:underline">
                                  Читать исследование →
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Похожие случаи */}
                    {educationalContent.similarCases?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Похожие случаи</h4>
                        <div className="space-y-3">
                          {educationalContent.similarCases.map((case_: any, index: number) => (
                            <div key={index} className="border border-gray-200 p-3">
                              <div className="font-medium text-xs mb-2">{case_.case}</div>
                              <p className="text-xs text-gray-600 mb-2">Подход: {case_.approach}</p>
                              <p className="text-xs text-gray-600 mb-2">Результат: {case_.result}</p>
                              <div className="text-xs text-gray-500">
                                Ключевые факторы: {case_.keyFactors?.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Образовательные материалы */}
                    {educationalContent.educationalMaterials?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Материалы для изучения</h4>
                        <div className="space-y-2">
                          {educationalContent.educationalMaterials.map((material: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50">
                              <div>
                                <span className="text-xs font-medium">{material.title}</span>
                                {material.duration && <span className="text-xs text-gray-500 ml-2">({material.duration})</span>}
                                <p className="text-xs text-gray-600">{material.description}</p>
                              </div>
                              <span className="text-xs bg-gray-200 px-2 py-1">{material.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Вкладка Экспорт */}
                {activeTab === 'export' && exportData && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Заключение для экспорта</h4>
                      <div className="border border-gray-200 p-3 bg-gray-50">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                          {exportData.reportSummary}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(exportData.reportSummary);
                          toast.success('Заключение скопировано в буфер обмена');
                        }}
                        className="text-xs bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        Копировать текст
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const blob = new Blob([exportData.reportSummary], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `ecg-analysis-${new Date().toISOString().split('T')[0]}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast.success('Файл загружен');
                        }}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Скачать
                      </Button>
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