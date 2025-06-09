
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, ArrowLeft, Calendar, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import BloodAnalysisForm from "@/components/blood-analysis/BloodAnalysisForm";
import BloodAnalysisResults from "@/components/blood-analysis/BloodAnalysisResults";
import { useBloodAnalysis } from "@/hooks/useBloodAnalysis";

// Моковые данные для списка анализов
const mockAnalyses = [
  {
    id: 1,
    date: "08.06.2025",
    type: "Анализ крови",
    status: "completed",
    normalCount: 14,
    deviationCount: 0,
    totalCount: 14,
    topMarkers: [
      { name: "Гемоглобин", value: "152 г/л", status: "normal" },
      { name: "Эритроциты", value: "4.5×10¹²/л", status: "normal" },
      { name: "Цветовой показатель", value: "0.9", status: "normal" }
    ]
  },
  {
    id: 2,
    date: "08.06.2025",
    type: "Анализ мочи", 
    status: "completed",
    normalCount: 9,
    deviationCount: 9,
    totalCount: 9,
    topMarkers: [
      { name: "Белок", value: "0.025", status: "high" },
      { name: "Сахар", value: "0.03", status: "high" },
      { name: "Кетоновые тела", value: "50 мг/сут", status: "high" }
    ]
  },
  {
    id: 3,
    date: "08.06.2025",
    type: "Анализ крови",
    status: "completed", 
    normalCount: 10,
    deviationCount: 0,
    totalCount: 13,
    topMarkers: [
      { name: "Эритроциты", value: "9.41×10¹²/л", status: "normal" },
      { name: "Гемоглобин", value: "152 г/л", status: "normal" },
      { name: "Гематокрит", value: "43.4%", status: "normal" }
    ]
  },
  {
    id: 4,
    date: "15.01.2025",
    type: "Общий анализ крови + биохимия",
    status: "completed",
    normalCount: 8,
    deviationCount: 0,
    totalCount: 13,
    topMarkers: [
      { name: "Гемоглобин", value: "142 г/л", status: "normal" },
      { name: "Эритроциты", value: "4.5×10¹²/л", status: "normal" },
      { name: "Лейкоциты", value: "6.8×10⁹/л", status: "normal" }
    ]
  },
  {
    id: 5,
    date: "10.01.2025", 
    type: "Гормональная панель",
    status: "completed",
    normalCount: 6,
    deviationCount: 0,
    totalCount: 7,
    topMarkers: [
      { name: "ТТГ", value: "2.8 мЕд/л", status: "normal" },
      { name: "Т4 свободный", value: "14.2 пмоль/л", status: "normal" },
      { name: "Т3 свободный", value: "4.8 пмоль/л", status: "normal" }
    ]
  },
  {
    id: 6,
    date: "05.01.2025",
    type: "Витамины и микроэлементы", 
    status: "completed",
    normalCount: 3,
    deviationCount: 0,
    totalCount: 8,
    topMarkers: [
      { name: "Витамин D", value: "18 нг/мл", status: "low" },
      { name: "Витамин B12", value: "285 пг/мл", status: "normal" },
      { name: "Фолиевая кислота", value: "8.2 нг/мл", status: "normal" }
    ]
  }
];

const LabAnalyses = () => {
  const navigate = useNavigate();
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const { results, isAnalyzing, activeTab, apiError, setActiveTab, analyzeBloodTest } = useBloodAnalysis();

  const handleViewAnalysis = (analysisId: number) => {
    navigate(`/analytics?id=${analysisId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-600";
      case "high": return "text-red-600";
      case "low": return "text-amber-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (normalCount: number, deviationCount: number) => {
    if (deviationCount === 0) return "🩸";
    if (deviationCount > normalCount) return "🔸";
    return "⚠️";
  };

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
                onClick={() => setShowNewAnalysis(false)}
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
                  <p className="text-gray-600">Загрузите результаты для анализа</p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Анализ крови с ИИ</CardTitle>
              </CardHeader>
              <CardContent>
                {activeTab === "input" && (
                  <BloodAnalysisForm 
                    onAnalyze={analyzeBloodTest}
                    isAnalyzing={isAnalyzing}
                  />
                )}
                
                {activeTab === "results" && (
                  <BloodAnalysisResults
                    results={results}
                    isAnalyzing={isAnalyzing}
                    apiError={apiError}
                    onBack={() => setActiveTab("input")}
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
                  <p className="text-gray-600">История загруженных и проанализированных результатов</p>
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

          {/* Analyses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAnalyses.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getStatusIcon(analysis.normalCount, analysis.deviationCount)}</div>
                      <div>
                        <CardTitle className="text-lg">{analysis.type}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4" />
                          {analysis.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Статистика */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analysis.normalCount}</div>
                        <div className="text-xs text-gray-500">Норма</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{analysis.deviationCount}</div>
                        <div className="text-xs text-gray-500">Отклонения</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-700">{analysis.totalCount}</div>
                        <div className="text-xs text-gray-500">Всего</div>
                      </div>
                    </div>
                  </div>

                  {/* Топ маркеры */}
                  <div className="space-y-2 mb-4">
                    {analysis.topMarkers.slice(0, 3).map((marker, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{marker.name}</span>
                        <span className={`font-medium ${getStatusColor(marker.status)}`}>
                          {marker.value}
                        </span>
                      </div>
                    ))}
                    {analysis.topMarkers.length > 3 && (
                      <div className="text-xs text-gray-500">+{analysis.totalCount - 3} ещё</div>
                    )}
                  </div>

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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LabAnalyses;
