
import React from "react";
import { ArrowLeft, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import MinimalFooter from "@/components/MinimalFooter";
import Header from "@/components/Header";
import NewAnalysisForm from "@/components/lab-analyses/NewAnalysisForm";

interface NewAnalysisViewProps {
  activeTab: string;
  results: any;
  isAnalyzing: boolean;
  apiError: string | null;
  onBack: () => void;
  onAnalyze: (data: {
    text: string;
    photoUrl: string;
    inputMethod: "text" | "photo";
    analysisType: string;
  }) => Promise<void>;
  onTabChange: (tab: string) => void;
  onNewAnalysisComplete: () => void;
}

const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  activeTab,
  results,
  isAnalyzing,
  apiError,
  onBack,
  onAnalyze,
  onTabChange,
  onNewAnalysisComplete,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        {/* Header section */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack}
                  className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Назад к списку</span>
                  <span className="sm:hidden">Назад</span>
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      Новый анализ
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                      Загрузите результаты для анализа с помощью ИИ
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1.5 rounded-full">
                  <Camera className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">Фото анализа - Pro</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <NewAnalysisForm
            activeTab={activeTab}
            results={results}
            isAnalyzing={isAnalyzing}
            apiError={apiError}
            onBack={onBack}
            onAnalyze={onAnalyze}
            onTabChange={onTabChange}
            onNewAnalysisComplete={onNewAnalysisComplete}
          />
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
};

export default NewAnalysisView;
