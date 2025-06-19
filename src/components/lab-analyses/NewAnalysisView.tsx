
import React from 'react';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MedicalAnalysisForm from '@/components/medical-analysis/MedicalAnalysisForm';
import MedicalAnalysisResults from '@/components/medical-analysis/MedicalAnalysisResults';
import { MedicalAnalysisResults as ResultsType } from '@/services/ai/medical-analysis';

interface NewAnalysisViewProps {
  activeTab: string;
  results: ResultsType | null;
  isAnalyzing: boolean;
  apiError: string | null;
  onBack: () => void;
  onAnalyze: (data: { 
    text: string; 
    photoUrl: string; 
    inputMethod: "text" | "photo";
    analysisType: string;
    testDate?: string;
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
  onNewAnalysisComplete
}) => {
  const handleBackToForm = () => {
    onTabChange("input");
  };

  React.useEffect(() => {
    if (results?.analysisId) {
      onNewAnalysisComplete();
    }
  }, [results, onNewAnalysisComplete]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Вернуться к списку анализов
            </Button>
          </div>

          {activeTab === "input" || !results ? (
            <MedicalAnalysisForm
              onAnalyze={onAnalyze}
              isAnalyzing={isAnalyzing}
            />
          ) : (
            <MedicalAnalysisResults
              results={results}
              isAnalyzing={isAnalyzing}
              apiError={apiError}
              onBack={handleBackToForm}
            />
          )}
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
};

export default NewAnalysisView;
