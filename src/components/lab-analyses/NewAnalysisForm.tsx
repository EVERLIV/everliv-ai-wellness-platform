
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import MedicalAnalysisResults from "@/components/medical-analysis/MedicalAnalysisResults";
import MedicalAnalysisForm from "@/components/medical-analysis/MedicalAnalysisForm";

interface NewAnalysisFormProps {
  activeTab: string;
  results: any;
  isAnalyzing: boolean;
  apiError: any;
  onBack: () => void;
  onAnalyze: (data: any) => Promise<void>;
  onTabChange: (tab: string) => void;
  onNewAnalysisComplete: () => void;
}

const NewAnalysisForm: React.FC<NewAnalysisFormProps> = ({
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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Универсальный анализатор медицинских тестов</CardTitle>
      </CardHeader>
      <CardContent>
        {activeTab === "input" && (
          <MedicalAnalysisForm
            onAnalyze={onAnalyze}
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {activeTab === "results" && (
          <MedicalAnalysisResults
            results={results}
            isAnalyzing={isAnalyzing}
            apiError={apiError}
            onBack={() => {
              onTabChange("input");
              onNewAnalysisComplete();
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default NewAnalysisForm;
