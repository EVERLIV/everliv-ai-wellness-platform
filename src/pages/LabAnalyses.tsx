
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, ArrowLeft, Calendar, FileText, Eye, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getMedicalAnalysesHistory } from "@/services/ai/medical-analysis";
import MedicalAnalysisForm from "@/components/medical-analysis/MedicalAnalysisForm";
import MedicalAnalysisResults from "@/components/medical-analysis/MedicalAnalysisResults";
import { useMedicalAnalysis } from "@/hooks/useMedicalAnalysis";
import { toast } from "sonner";

const LabAnalyses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const { 
    results, 
    isAnalyzing, 
    activeTab, 
    apiError, 
    setActiveTab, 
    setResults, 
    analyzeMedicalTest 
  } = useMedicalAnalysis();

  // Загрузка истории анализов
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      
      try {
        setLoadingHistory(true);
        const history = await getMedicalAnalysesHistory(user.id);
        setAnalysisHistory(history);
      } catch (error) {
        console.error("Ошибка загрузки истории:", error);
        toast.error("Не удалось загрузить историю анализов");
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user]);

  const handleViewAnalysis = (analysisId: string) => {
    navigate(`/analytics?id=${analysisId}`);
  };

  const getAnalysisTypeLabel = (type: string) => {
    const types = {
      blood: "Анализ крови",
      urine: "Анализ мочи", 
      biochemistry: "Биохимический анализ",
      hormones: "Гормональная панель",
      vitamins: "Витамины и микроэлементы",
      immunology: "Иммунологические исследования",
      oncology: "Онкомаркеры",
      cardiology: "Кардиологические маркеры",
      other: "Другой анализ"
    };
    return types[type] || type;
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return "🔴";
      case 'medium':
        return "🟡";
      default:
        return "🟢";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'high':
        return 'Высокий риск';
      case 'medium':
        return 'Средний риск';
      default:
        return 'Низкий риск';
    }
  };

  const handleNewAnalysisComplete = () => {
    // Обновляем историю после успешного анализа
    if (user) {
      getMedicalAnalysesHistory(user.id).then(setAnalysisHistory);
    }
    // Закрываем форму нового анализа только если результаты получены
    if (results) {
      setShowNewAnalysis(false);
    }
  };

  // Автоматически обновляем историю при получении результатов
  useEffect(() => {
    if (results?.analysisId && user) {
      getMedicalAnalysesHistory(user.id).then(setAnalysisHistory);
    }
  }, [results, user]);

  if (showNewAnalysis) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowNewAnalysis(false);
                  setResults(null);
                  setActiveTab("input");
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад к списку
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Новый анализ</h1>
                  <p className="text-gray-600">Загрузите результаты для анализа с помощью ИИ</p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Универсальный анализатор медицинских тестов</CardTitle>
              </CardHeader>
              <CardContent>
                {activeTab === "input" && (
                  <MedicalAnalysisForm 
                    onAnalyze={analyzeMedicalTest}
                    isAnalyzing={isAnalyzing}
                  />
                )}
                
                {activeTab === "results" && (
                  <MedicalAnalysisResults
                    results={results}
                    isAnalyzing={isAnalyzing}
                    apiError={apiError}
                    onBack={() => {
                      setActiveTab("input");
                      handleNewAnalysisComplete();
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Ваши анализы</h1>
                  <p className="text-gray-600">История проанализированных результатов с помощью ИИ</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowNewAnalysis(true)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Добавить анализ
            </Button>
          </div>

          {/* История анализов */}
          {loadingHistory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : analysisHistory.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">🔬</div>
                <h3 className="text-xl font-semibold mb-2">Пока нет анализов</h3>
                <p className="text-gray-600 mb-6">
                  Загрузите свой первый медицинский анализ для обработки с помощью ИИ
                </p>
                <Button 
                  onClick={() => setShowNewAnalysis(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Добавить первый анализ
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisHistory.map((analysis) => (
                <Card key={analysis.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getRiskIcon(analysis.results?.riskLevel || 'low')}</div>
                        <div>
                          <CardTitle className="text-lg">
                            {getAnalysisTypeLabel(analysis.analysis_type)}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(analysis.created_at).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </div>
                      <Badge variant={getRiskColor(analysis.results?.riskLevel || 'low')} className="text-xs">
                        {getRiskText(analysis.results?.riskLevel || 'low')}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Статистика показателей */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {analysis.results?.markers?.filter(m => m.status === 'normal').length || 0}
                          </div>
                          <div className="text-xs text-gray-500">Норма</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">
                            {analysis.results?.markers?.filter(m => m.status !== 'normal').length || 0}
                          </div>
                          <div className="text-xs text-gray-500">Отклонения</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700">
                            {analysis.results?.markers?.length || 0}
                          </div>
                          <div className="text-xs text-gray-500">Всего</div>
                        </div>
                      </div>
                    </div>

                    {/* Краткое резюме */}
                    {analysis.results?.summary && (
                      <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {analysis.results.summary}
                      </div>
                    )}

                    {/* Кнопка просмотра */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => handleViewAnalysis(analysis.id)}
                    >
                      <Eye className="h-4 w-4" />
                      Посмотреть детали
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LabAnalyses;
