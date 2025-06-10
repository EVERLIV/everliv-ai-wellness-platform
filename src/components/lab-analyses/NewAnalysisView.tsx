
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MinimalFooter from "@/components/MinimalFooter";
import Header from "@/components/Header";
import NewAnalysisForm from "@/components/lab-analyses/NewAnalysisForm";

interface NewAnalysisViewProps {
  activeTab: string;
  results: any;
  isAnalyzing: boolean;
  apiError: string | null;
  analysisHistory: any[];
  loadingHistory: boolean;
  onBack: () => void;
  onAnalyze: (data: {
    text: string;
    photoUrl: string;
    inputMethod: "text" | "photo";
    analysisType: string;
  }) => Promise<void>;
  onTabChange: (tab: string) => void;
  onViewAnalysis: (analysisId: string) => void;
  onNewAnalysisComplete: () => void;
}

const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  activeTab,
  results,
  isAnalyzing,
  apiError,
  analysisHistory,
  loadingHistory,
  onBack,
  onAnalyze,
  onTabChange,
  onViewAnalysis,
  onNewAnalysisComplete,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
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
            onBack={onBack}
            onAnalyze={onAnalyze}
            onTabChange={onTabChange}
            onViewAnalysis={onViewAnalysis}
            onNewAnalysisComplete={onNewAnalysisComplete}
          />
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
};

export default NewAnalysisView;
