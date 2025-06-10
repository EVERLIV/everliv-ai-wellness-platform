
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalAnalysis } from "@/hooks/useMedicalAnalysis";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";
import AnalysisHistory from "@/components/lab-analyses/AnalysisHistory";
import NewAnalysisForm from "@/components/lab-analyses/NewAnalysisForm";
import MedicalDataDisclaimer from "@/components/lab-analyses/MedicalDataDisclaimer";
import LabAnalysesHeader from "@/components/lab-analyses/LabAnalysesHeader";
import LabAnalysesStats from "@/components/lab-analyses/LabAnalysesStats";

const LabAnalyses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  
  const { 
    analysisHistory, 
    loadingHistory, 
    statistics, 
    refreshHistory 
  } = useLabAnalysesData();
  
  const { 
    results, 
    isAnalyzing, 
    activeTab, 
    apiError, 
    setActiveTab, 
    setResults, 
    analyzeMedicalTest 
  } = useMedicalAnalysis();

  const handleViewAnalysis = (analysisId: string) => {
    navigate(`/analytics?id=${analysisId}`);
  };

  const handleNewAnalysisComplete = () => {
    // Refresh history after successful analysis
    refreshHistory();
  };

  // Auto-refresh history when results are received
  useEffect(() => {
    if (results?.analysisId && user) {
      refreshHistory();
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
                  <ArrowLeft className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Новый анализ</h1>
                  <p className="text-gray-600">Загрузите результаты для анализа с помощью ИИ</p>
                </div>
              </div>
            </div>

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
          {/* Header */}
          <LabAnalysesHeader onAddNewAnalysis={() => setShowNewAnalysis(true)} />

          {/* Statistics */}
          <LabAnalysesStats statistics={statistics} />

          {/* Analysis History */}
          <AnalysisHistory
            analysisHistory={analysisHistory}
            loadingHistory={loadingHistory}
            onViewAnalysis={handleViewAnalysis}
            onAddNewAnalysis={() => setShowNewAnalysis(true)}
          />

          {/* Medical Data Disclaimer */}
          <MedicalDataDisclaimer />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LabAnalyses;
