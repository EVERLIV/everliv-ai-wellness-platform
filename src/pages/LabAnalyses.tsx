
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalAnalysis } from "@/hooks/useMedicalAnalysis";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";
import AnalysisHistory from "@/components/lab-analyses/AnalysisHistory";
import MedicalDataDisclaimer from "@/components/lab-analyses/MedicalDataDisclaimer";
import LabAnalysesHeader from "@/components/lab-analyses/LabAnalysesHeader";
import LabAnalysesStats from "@/components/lab-analyses/LabAnalysesStats";
import NewAnalysisView from "@/components/lab-analyses/NewAnalysisView";

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

  // Детальное логирование состояния компонента
  useEffect(() => {
    console.log('🏥 LabAnalyses: Component state update:', {
      userId: user?.id,
      userEmail: user?.email,
      showNewAnalysis,
      historyCount: analysisHistory?.length || 0,
      isLoadingHistory: loadingHistory,
      statistics,
      hasResults: !!results,
      analysisHistory: analysisHistory
    });
  }, [user, showNewAnalysis, analysisHistory, loadingHistory, statistics, results]);

  // Логирование при монтировании компонента
  useEffect(() => {
    console.log('🏥 LabAnalyses: Component mounted, current user:', {
      id: user?.id,
      email: user?.email
    });
  }, []);

  const handleViewAnalysis = (analysisId: string) => {
    console.log('🔍 LabAnalyses: Navigating to analysis details:', analysisId);
    navigate(`/analysis-details?id=${analysisId}`);
  };

  const handleNewAnalysisComplete = () => {
    console.log('✅ LabAnalyses: New analysis completed, refreshing history');
    refreshHistory();
  };

  const handleBackToList = () => {
    console.log('⬅️ LabAnalyses: Returning to analysis list');
    setShowNewAnalysis(false);
    setResults(null);
    setActiveTab("input");
  };

  // Auto-refresh history when results are received
  useEffect(() => {
    if (results?.analysisId && user) {
      console.log('🔄 LabAnalyses: New analysis result received, auto-refreshing history:', results.analysisId);
      refreshHistory();
    }
  }, [results, user, refreshHistory]);

  if (showNewAnalysis) {
    console.log('➕ LabAnalyses: Showing new analysis view');
    return (
      <NewAnalysisView
        activeTab={activeTab}
        results={results}
        isAnalyzing={isAnalyzing}
        apiError={apiError}
        onBack={handleBackToList}
        onAnalyze={analyzeMedicalTest}
        onTabChange={setActiveTab}
        onNewAnalysisComplete={handleNewAnalysisComplete}
      />
    );
  }

  console.log('📊 LabAnalyses: Rendering main view with:', {
    historyCount: analysisHistory?.length || 0,
    loadingHistory,
    statistics
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <LabAnalysesHeader 
          onAddNewAnalysis={() => {
            console.log('➕ LabAnalyses: Adding new analysis');
            setShowNewAnalysis(true);
          }}
          currentMonthAnalysesCount={statistics.currentMonthAnalyses}
        />
        
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
          <LabAnalysesStats statistics={statistics} />
          <AnalysisHistory
            analysisHistory={analysisHistory}
            loadingHistory={loadingHistory}
            onViewAnalysis={handleViewAnalysis}
            onAddNewAnalysis={() => {
              console.log('➕ LabAnalyses: Adding new analysis from history');
              setShowNewAnalysis(true);
            }}
            onRefresh={() => {
              console.log('🔄 LabAnalyses: Manual refresh triggered');
              refreshHistory();
            }}
          />
          <MedicalDataDisclaimer />
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
};

export default LabAnalyses;
