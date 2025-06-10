
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import BiomarkersList from "@/components/analytics/BiomarkersList";
import BiomarkerDetails from "@/components/analytics/BiomarkerDetails";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HealthData {
  overview: {
    healthScore: number;
    riskLevel: string;
    lastUpdated: string;
  };
  biomarkers: Array<{
    id: string;
    name: string;
    value: number;
    unit: string;
    status: 'optimal' | 'good' | 'attention' | 'risk';
    trend: 'up' | 'down' | 'stable';
    referenceRange: string;
    lastMeasured: string;
  }>;
  recommendations: Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
  }>;
  riskFactors: Array<{
    id: string;
    factor: string;
    level: 'high' | 'medium' | 'low';
    description: string;
    mitigation: string;
  }>;
  supplements: Array<{
    id: string;
    name: string;
    dosage: string;
    benefit: string;
    timing: string;
  }>;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [selectedBiomarker, setSelectedBiomarker] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorQuestion, setDoctorQuestion] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  useEffect(() => {
    if (user) {
      loadHealthData();
    }
  }, [user]);

  const loadHealthData = async () => {
    try {
      setIsLoading(true);
      
      // Загружаем данные анализов пользователя
      const { data: analyses, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Генерируем комплексную аналитику на основе данных
      if (analyses && analyses.length > 0) {
        await generateHealthAnalytics(analyses);
      } else {
        // Используем демо-данные если анализов нет
        setHealthData(generateDemoHealthData());
      }
    } catch (error) {
      console.error('Error loading health data:', error);
      toast.error('Ошибка загрузки данных аналитики');
      setHealthData(generateDemoHealthData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateHealthAnalytics = async (analyses: any[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-health-analytics', {
        body: { analyses, userId: user?.id }
      });

      if (error) throw error;
      
      setHealthData(data.healthData);
    } catch (error) {
      console.error('Error generating analytics:', error);
      setHealthData(generateDemoHealthData());
    }
  };

  const generateDemoHealthData = (): HealthData => {
    return {
      overview: {
        healthScore: 78,
        riskLevel: 'medium',
        lastUpdated: new Date().toISOString()
      },
      biomarkers: [
        {
          id: '1',
          name: 'Холестерин общий',
          value: 5.2,
          unit: 'ммоль/л',
          status: 'attention',
          trend: 'up',
          referenceRange: '3.3-5.2',
          lastMeasured: '2024-01-15'
        },
        {
          id: '2',
          name: 'Глюкоза',
          value: 4.8,
          unit: 'ммоль/л',
          status: 'optimal',
          trend: 'stable',
          referenceRange: '3.9-5.9',
          lastMeasured: '2024-01-15'
        },
        {
          id: '3',
          name: 'Витамин D',
          value: 28,
          unit: 'нг/мл',
          status: 'risk',
          trend: 'down',
          referenceRange: '30-100',
          lastMeasured: '2024-01-10'
        }
      ],
      recommendations: [
        {
          id: '1',
          category: 'Питание',
          title: 'Увеличить потребление омега-3',
          description: 'Включите в рацион жирную рыбу 2-3 раза в неделю',
          priority: 'high',
          action: 'Добавить в план питания'
        },
        {
          id: '2',
          category: 'Активность',
          title: 'Кардио тренировки',
          description: 'Минимум 150 минут умеренной активности в неделю',
          priority: 'medium',
          action: 'Создать план тренировок'
        }
      ],
      riskFactors: [
        {
          id: '1',
          factor: 'Дефицит витамина D',
          level: 'high',
          description: 'Низкий уровень витамина D может влиять на иммунитет',
          mitigation: 'Прием добавок и увеличение времени на солнце'
        }
      ],
      supplements: [
        {
          id: '1',
          name: 'Витамин D3',
          dosage: '2000 МЕ',
          benefit: 'Поддержка иммунитета и костей',
          timing: 'Утром с едой'
        }
      ]
    };
  };

  const handleDoctorQuestion = async () => {
    if (!doctorQuestion.trim()) return;
    
    setIsProcessingQuestion(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-doctor-analytics', {
        body: {
          question: doctorQuestion,
          healthData: healthData,
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Для доступа к аналитике необходимо войти в систему</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500">Загрузка аналитики здоровья...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="pt-16">
        <AnalyticsHeader 
          healthScore={healthData?.overview.healthScore || 0}
          riskLevel={healthData?.overview.riskLevel || 'unknown'}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          {/* Общая сводка */}
          <AnalyticsSummary 
            healthData={healthData}
            onDoctorQuestion={handleDoctorQuestion}
            doctorQuestion={doctorQuestion}
            setDoctorQuestion={setDoctorQuestion}
            doctorResponse={doctorResponse}
            isProcessingQuestion={isProcessingQuestion}
          />
          
          {/* Список биомаркеров и детали */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <BiomarkersList 
                biomarkers={healthData?.biomarkers || []}
                selectedBiomarker={selectedBiomarker}
                onSelectBiomarker={setSelectedBiomarker}
              />
            </div>
            
            <div className="lg:col-span-2">
              <BiomarkerDetails 
                biomarker={healthData?.biomarkers.find(b => b.id === selectedBiomarker)}
                recommendations={healthData?.recommendations || []}
                riskFactors={healthData?.riskFactors || []}
                supplements={healthData?.supplements || []}
              />
            </div>
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default Analytics;
