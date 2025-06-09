
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getMedicalAnalysisById } from "@/services/ai/medical-analysis";
import MedicalAnalysisResults from "@/components/medical-analysis/MedicalAnalysisResults";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalysisData = async () => {
      if (!analysisId || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMedicalAnalysisById(analysisId, user.id);
        setAnalysisData(data);
      } catch (error) {
        console.error("Ошибка загрузки анализа:", error);
        setError("Не удалось загрузить данные анализа");
        toast.error("Не удалось загрузить анализ");
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, [analysisId, user]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-64 bg-gray-200 rounded"></div>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/lab-analyses")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад к анализам
              </Button>
            </div>

            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold mb-2">Анализ не найден</h3>
                <p className="text-gray-600 mb-6">
                  {error || "Не удалось найти указанный анализ"}
                </p>
                <Button onClick={() => navigate("/lab-analyses")}>
                  Вернуться к списку анализов
                </Button>
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
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/lab-analyses")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к анализам
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {getAnalysisTypeLabel(analysisData.analysis_type)}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(analysisData.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Результаты анализа */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <MedicalAnalysisResults
                results={analysisData.results}
                isAnalyzing={false}
                apiError={null}
                onBack={() => navigate("/lab-analyses")}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;
