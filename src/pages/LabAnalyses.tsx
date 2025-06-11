
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

  const handleViewAnalysis = (analysisId: string) => {
    navigate(`/analysis-details?id=${analysisId}`);
  };

  const handleNewAnalysisComplete = () => {
    refreshHistory();
  };

  const handleBackToList = () => {
    setShowNewAnalysis(false);
    setResults(null);
    setActiveTab("input");
  };

  // Auto-refresh history when results are received
  useEffect(() => {
    if (results?.analysisId && user) {
      refreshHistory();
    }
  }, [results, user]);

  if (showNewAnalysis) {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <LabAnalysesHeader onAddNewAnalysis={() => setShowNewAnalysis(true)} />
        
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
          <LabAnalysesStats statistics={statistics} />
          <AnalysisHistory
            analysisHistory={analysisHistory}
            loadingHistory={loadingHistory}
            onViewAnalysis={handleViewAnalysis}
            onAddNewAnalysis={() => setShowNewAnalysis(true)}
            onRefresh={refreshHistory}
          />
          <MedicalDataDisclaimer />
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
};

export default LabAnalyses;
