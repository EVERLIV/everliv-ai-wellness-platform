
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, AlertTriangle, Activity, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface HealthStats {
  totalAnalyses: number;
  totalConsultations: number;
  lastAnalysisDate?: string;
  riskLevel?: string;
  hasRecentActivity: boolean;
}

interface AnalysisResults {
  riskLevel?: string;
  markers?: Array<{
    name: string;
    value: any;
    status: string;
  }>;
}

const DashboardHealthSummary = () => {
  const { user } = useAuth();
  const [healthStats, setHealthStats] = useState<HealthStats>({
    totalAnalyses: 0,
    totalConsultations: 0,
    hasRecentActivity: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHealthStats();
    }
  }, [user]);

  const loadHealthStats = async () => {
    try {
      setIsLoading(true);

      // Загружаем статистику анализов
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('created_at, results')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      // Загружаем статистику консультаций
      const { data: chats, error: chatsError } = await supabase
        .from('ai_doctor_chats')
        .select('created_at')
        .eq('user_id', user?.id);

      if (!analysesError && !chatsError) {
        const totalAnalyses = analyses?.length || 0;
        const totalConsultations = chats?.length || 0;
        
        // Определяем уровень риска на основе последних анализов
        let riskLevel = 'low';
        if (analyses && analyses.length > 0) {
          const latestAnalysis = analyses[0];
          const results = latestAnalysis.results as AnalysisResults;
          
          if (results?.riskLevel) {
            riskLevel = results.riskLevel;
          } else if (results?.markers) {
            const riskMarkers = results.markers.filter((marker) => 
              marker.status === 'attention' || marker.status === 'risk' || marker.status === 'high' || marker.status === 'low'
            );
            const totalMarkers = results.markers.length;
            const riskPercentage = riskMarkers.length / totalMarkers;
            
            if (riskPercentage >= 0.5) riskLevel = 'high';
            else if (riskPercentage >= 0.2) riskLevel = 'medium';
          }
        }

        // Проверяем недавнюю активность (последние 7 дней)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const hasRecentActivity = analyses?.some(analysis => 
          new Date(analysis.created_at) > weekAgo
        ) || false;

        setHealthStats({
          totalAnalyses,
          totalConsultations,
          lastAnalysisDate: analyses?.[0]?.created_at,
          riskLevel,
          hasRecentActivity
        });
      }
    } catch (error) {
      console.error('Error loading health stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'Высокий риск';
      case 'medium': return 'Умеренный риск';
      case 'low': return 'Низкий риск';
      default: return 'Не определен';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationMessage = () => {
    if (healthStats.totalAnalyses === 0) {
      return {
        icon: FileText,
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200',
        title: 'Начните с анализов',
        message: 'Загрузите первый анализ крови для получения персональных рекомендаций'
      };
    }

    if (!healthStats.hasRecentActivity) {
      return {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50 border-yellow-200',
        title: 'Обновите данные',
        message: 'Рекомендуется загрузить свежие анализы для актуальных рекомендаций'
      };
    }

    if (healthStats.riskLevel === 'high') {
      return {
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
        title: 'Требуется внимание',
        message: 'Обнаружены показатели, требующие внимания. Рекомендуется консультация врача'
      };
    }

    return {
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      title: 'Отличная работа!',
      message: 'Ваши показатели в норме. Продолжайте следить за здоровьем'
    };
  };

  const recommendation = getRecommendationMessage();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Сводка здоровья
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
              </div>
              <div className="text-center">
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {healthStats.totalAnalyses}
                </div>
                <div className="text-sm text-gray-500">Анализов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {healthStats.totalConsultations}
                </div>
                <div className="text-sm text-gray-500">Консультаций</div>
              </div>
            </div>

            {healthStats.riskLevel && healthStats.totalAnalyses > 0 && (
              <div className={`mb-4 p-3 rounded-lg border ${getRiskLevelColor(healthStats.riskLevel)}`}>
                <div className="text-sm font-medium">
                  Уровень риска: {getRiskLevelText(healthStats.riskLevel)}
                </div>
                {healthStats.lastAnalysisDate && (
                  <div className="text-xs mt-1 opacity-75">
                    Последний анализ: {new Date(healthStats.lastAnalysisDate).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>
            )}
            
            <div className={`border rounded-lg p-4 ${recommendation.bg}`}>
              <div className="flex items-start gap-3">
                <recommendation.icon className={`h-5 w-5 ${recommendation.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <h4 className={`font-medium ${recommendation.color} mb-1`}>
                    {recommendation.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {recommendation.message}
                  </p>
                  {healthStats.totalAnalyses === 0 && (
                    <Button 
                      size="sm" 
                      onClick={() => window.location.href = '/lab-analyses'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Загрузить анализ
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardHealthSummary;
