
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getMedicalAnalysesHistory } from "@/services/ai/medical-analysis";
import { useMedicalAnalysis } from "@/hooks/useMedicalAnalysis";
import { toast } from "sonner";
import AnalysisHistory from "@/components/lab-analyses/AnalysisHistory";
import NewAnalysisForm from "@/components/lab-analyses/NewAnalysisForm";
import MedicalDataDisclaimer from "@/components/lab-analyses/MedicalDataDisclaimer";

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

  const handleNewAnalysisComplete = () => {
    // Обновляем историю после успешного анализа
    if (user) {
      getMedicalAnalysesHistory(user.id).then(setAnalysisHistory);
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

            <MedicalDataDisclaimer />

            <NewAnalysisForm
              activeTab={activeTab}
              results={results}
              isAnalyzing={isAnalyzing}
              apiError={apiError}
              analysisHistory={analysisHistory}
              loadingHistory={loadingHistory}
              onBack={() => {
                setShowNewAnalysis(false);
                setResults(null);
                setActiveTab("input");
              }}
              onAnalyze={analyzeMedicalTest}
              onTabChange={setActiveTab}
              onViewAnalysis={handleViewAnalysis}
              onNewAnalysisComplete={handleNewAnalysisComplete}
            />
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
          {/* Header с улучшенным дизайном */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад к панели
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Лабораторные анализы</h1>
                  <p className="text-gray-600">Управление и анализ ваших медицинских результатов</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowNewAnalysis(true)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              Добавить анализ
            </Button>
          </div>

          {/* Дисклеймер о качестве медицинских данных */}
          <MedicalDataDisclaimer />

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Всего анализов</p>
                    <p className="text-2xl font-bold text-gray-900">{analysisHistory.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">В норме</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analysisHistory.reduce((acc, analysis) => 
                        acc + (analysis.results?.markers?.filter(m => m.status === 'optimal' || m.status === 'good').length || 0), 0
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Требуют внимания</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analysisHistory.reduce((acc, analysis) => 
                        acc + (analysis.results?.markers?.filter(m => m.status === 'attention' || m.status === 'risk').length || 0), 0
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* История анализов */}
          <AnalysisHistory
            analysisHistory={analysisHistory}
            loadingHistory={loadingHistory}
            onViewAnalysis={handleViewAnalysis}
            onAddNewAnalysis={() => setShowNewAnalysis(true)}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LabAnalyses;
