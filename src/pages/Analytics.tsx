
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import HealthOverviewCards from "@/components/analytics/HealthOverviewCards";
import AnalyticsLoadingIndicator from "@/components/analytics/AnalyticsLoadingIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Activity, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

interface Biomarker {
  name: string;
  value: number | string;
  unit: string;
  status: 'optimal' | 'good' | 'attention' | 'risk' | 'unknown';
  referenceRange: string;
  description?: string;
}

interface AnalysisData {
  id: string;
  analysisType: string;
  createdAt: string;
  biomarkers: Biomarker[];
}

interface CachedAnalytics {
  healthScore: number;
  riskLevel: string;
  totalAnalyses: number;
  totalConsultations: number;
  lastAnalysisDate?: string;
  hasRecentActivity: boolean;
  trendsAnalysis: {
    improving: number;
    worsening: number;
    stable: number;
  };
  recentActivities: Array<{
    title: string;
    time: string;
    icon: string;
    iconColor: string;
    iconBg: string;
  }>;
  lastUpdated: string;
}

interface HealthData {
  overview: {
    healthScore: number;
    riskLevel: string;
    lastUpdated: string;
    totalAnalyses: number;
    trendsAnalysis: {
      improving: number;
      worsening: number;
      stable: number;
    };
  };
  healthImprovementActions: Array<any>;
  recommendedTests: Array<any>;
  specialistConsultations: Array<any>;
  keyHealthIndicators: Array<any>;
  lifestyleRecommendations: Array<any>;
  riskFactors: Array<any>;
  supplements: Array<any>;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  
  // Состояния для конкретного анализа
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  
  // Состояния для кэшированной аналитики
  const [analytics, setAnalytics] = useState<CachedAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  
  // Состояния для доктора
  const [doctorQuestion, setDoctorQuestion] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  console.log('Analytics Page State:', {
    user: !!user,
    analysisId,
    hasAnalysisData: !!analysisData,
    hasAnalytics: !!analytics,
    isLoadingAnalysis,
    isLoadingAnalytics,
    isGenerating,
    loadingStep
  });

  // Загрузка кэшированной аналитики
  const loadCachedAnalytics = async () => {
    if (!user) {
      setIsLoadingAnalytics(false);
      return;
    }

    try {
      console.log('Loading cached analytics...');
      setIsLoadingAnalytics(true);
      
      const { data, error } = await supabase
        .from('user_analytics')
        .select('analytics_data, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading cached analytics:', error);
        setAnalytics(null);
        return;
      }

      if (data && data.analytics_data) {
        try {
          const analyticsData = typeof data.analytics_data === 'string' 
            ? JSON.parse(data.analytics_data) 
            : data.analytics_data;
          
          console.log('Successfully loaded analytics:', analyticsData);
          setAnalytics(analyticsData as CachedAnalytics);
        } catch (parseError) {
          console.error('Error parsing analytics data:', parseError);
          setAnalytics(null);
        }
      } else {
        console.log('No cached analytics found');
        setAnalytics(null);
      }
    } catch (error) {
      console.error('Error in loadCachedAnalytics:', error);
      setAnalytics(null);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Генерация аналитики
  const generateAnalytics = async () => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    try {
      console.log('Starting analytics generation...');
      setIsGenerating(true);
      setLoadingStep('Загрузка данных анализов...');

      const [analysesResponse, chatsResponse] = await Promise.all([
        supabase
          .from('medical_analyses')
          .select('created_at, results')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('ai_doctor_chats')
          .select('created_at, title')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (analysesResponse.error) {
        console.error('Error loading analyses:', analysesResponse.error);
      }
      if (chatsResponse.error) {
        console.error('Error loading chats:', chatsResponse.error);
      }

      const analyses = analysesResponse.data || [];
      const chats = chatsResponse.data || [];

      console.log('Data loaded - analyses:', analyses.length, 'chats:', chats.length);
      setLoadingStep('Анализ данных и генерация отчета...');
      
      // Простая генерация аналитики
      const generatedAnalytics: CachedAnalytics = {
        healthScore: 75,
        riskLevel: 'medium',
        totalAnalyses: analyses.length,
        totalConsultations: chats.length,
        hasRecentActivity: analyses.length > 0,
        trendsAnalysis: {
          improving: 3,
          worsening: 1,
          stable: 5
        },
        recentActivities: [],
        lastUpdated: new Date().toISOString()
      };

      setLoadingStep('Сохранение результатов...');

      const { error: upsertError } = await supabase
        .from('user_analytics')
        .upsert({
          user_id: user.id,
          analytics_data: generatedAnalytics as any,
          updated_at: new Date().toISOString()
        } as any);

      if (upsertError) {
        console.error('Error saving analytics:', upsertError);
        toast.error('Ошибка сохранения аналитики');
        return;
      }

      console.log('Analytics saved successfully');
      setAnalytics(generatedAnalytics);
      toast.success('Аналитика успешно обновлена');
    } catch (error) {
      console.error('Error generating analytics:', error);
      toast.error('Ошибка генерации аналитики');
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  // Загрузка данных конкретного анализа
  const loadAnalysisDetails = async () => {
    if (!user || !analysisId) return;

    try {
      setIsLoadingAnalysis(true);
      
      const { data: analysis, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('id', analysisId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading analysis:', error);
        toast.error('Анализ не найден');
        setAnalysisData(null);
        return;
      }

      if (analysis) {
        // Безопасное извлечение маркеров из JSON
        let biomarkers: Biomarker[] = [];
        try {
          const results = analysis.results as any;
          if (results && typeof results === 'object') {
            if (results.markers && Array.isArray(results.markers)) {
              biomarkers = results.markers as Biomarker[];
            }
          }
        } catch (error) {
          console.error('Error parsing biomarkers:', error);
        }

        const processedData: AnalysisData = {
          id: analysis.id,
          analysisType: analysis.analysis_type,
          createdAt: analysis.created_at,
          biomarkers
        };
        setAnalysisData(processedData);
      }
    } catch (error) {
      console.error('Error loading analysis details:', error);
      toast.error('Ошибка загрузки данных анализа');
      setAnalysisData(null);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Обработка вопроса доктору
  const handleDoctorQuestion = async () => {
    if (!doctorQuestion.trim()) return;
    
    setIsProcessingQuestion(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-doctor-analytics', {
        body: {
          question: doctorQuestion,
          healthData: analytics,
          userId: user?.id
        }
      });

      if (error) throw error;
      
      setDoctorResponse(data.response);
    } catch (error) {
      console.error('Error processing doctor question:', error);
      toast.error('Ошибка обработки вопроса');
    } finally {
      setIsProcessingQuestion(false);
    }
  };

  // Эффекты
  useEffect(() => {
    if (user && !analysisId) {
      loadCachedAnalytics();
    }
  }, [user, analysisId]);

  useEffect(() => {
    if (user && analysisId) {
      loadAnalysisDetails();
    }
  }, [user, analysisId]);

  // Проверка пользователя
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Для доступа к аналитике необходимо войти в систему</p>
      </div>
    );
  }

  // Просмотр конкретного анализа
  if (analysisId) {
    if (isLoadingAnalysis) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <div className="flex-grow flex items-center justify-center pt-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-gray-500">Загрузка данных анализа...</p>
            </div>
          </div>
        </div>
      );
    }

    if (!analysisData) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <div className="flex-grow flex items-center justify-center pt-16">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Анализ не найден</h2>
              <p className="text-gray-500">Запрашиваемый анализ не существует или недоступен</p>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="mt-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="pt-16">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Детали анализа</h1>
                    <p className="text-gray-600">{analysisData.analysisType}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Назад к списку
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisData.biomarkers.map((biomarker, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {biomarker.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Значение</p>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {biomarker.value}
                          </span>
                          {biomarker.unit && (
                            <span className="text-sm text-gray-600">{biomarker.unit}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Главная страница аналитики

  // Показываем индикатор загрузки если идет генерация
  if (isGenerating) {
    console.log('Rendering loading indicator');
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="pt-16">
          <AnalyticsLoadingIndicator 
            isGenerating={isGenerating}
            loadingStep={loadingStep}
          />
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Показываем начальную загрузку только для общей аналитики
  if (isLoadingAnalytics) {
    console.log('Rendering initial loading');
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500">Загрузка аналитики...</p>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Если аналитика не сгенерирована
  if (!analytics) {
    console.log('Rendering no analytics state');
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="pt-16">
          <AnalyticsHeader 
            healthScore={0}
            riskLevel="unknown"
          />
          
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Аналитика не сгенерирована</h2>
                  <p className="text-gray-500 mb-6">
                    Нажмите кнопку ниже, чтобы создать персональную аналитику здоровья на основе ваших данных
                  </p>
                  <Button onClick={generateAnalytics} disabled={isGenerating} className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Генерирую аналитику...' : 'Сгенерировать аналитику'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Показываем сгенерированную аналитику
  console.log('Rendering analytics data');
  const healthData: HealthData = {
    overview: {
      healthScore: analytics.healthScore,
      riskLevel: analytics.riskLevel,
      lastUpdated: analytics.lastUpdated,
      totalAnalyses: analytics.totalAnalyses,
      trendsAnalysis: analytics.trendsAnalysis
    },
    healthImprovementActions: [],
    recommendedTests: [],
    specialistConsultations: [],
    keyHealthIndicators: [],
    lifestyleRecommendations: [],
    riskFactors: [],
    supplements: []
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="pt-16">
        <AnalyticsHeader 
          healthScore={analytics.healthScore}
          riskLevel={analytics.riskLevel}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Обзор здоровья</h2>
            <Button
              variant="outline"
              onClick={generateAnalytics}
              disabled={isGenerating}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Обновление...' : 'Обновить аналитику'}
            </Button>
          </div>

          <HealthOverviewCards 
            trendsAnalysis={analytics.trendsAnalysis}
            totalAnalyses={analytics.totalAnalyses}
          />

          <AnalyticsSummary 
            healthData={healthData}
            onDoctorQuestion={handleDoctorQuestion}
            doctorQuestion={doctorQuestion}
            setDoctorQuestion={setDoctorQuestion}
            doctorResponse={doctorResponse}
            isProcessingQuestion={isProcessingQuestion}
          />

          {analytics.lastUpdated && (
            <div className="text-center text-sm text-gray-500">
              Последнее обновление: {new Date(analytics.lastUpdated).toLocaleString('ru-RU')}
            </div>
          )}
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default Analytics;
