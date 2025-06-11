
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import MedicalAnalysisResults from "@/components/medical-analysis/MedicalAnalysisResults";
import AnalysisInputMethods from "./AnalysisInputMethods";
import AnalysisHistory from "./AnalysisHistory";

interface NewAnalysisFormProps {
  activeTab: string;
  results: any;
  isAnalyzing: boolean;
  apiError: any;
  analysisHistory: any[];
  loadingHistory: boolean;
  onAnalyze: (data: any) => Promise<void>;
  onTabChange: (tab: string) => void;
  onViewAnalysis: (analysisId: string) => void;
  onNewAnalysisComplete: () => void;
}

const NewAnalysisForm: React.FC<NewAnalysisFormProps> = ({
  activeTab,
  results,
  isAnalyzing,
  apiError,
  analysisHistory,
  loadingHistory,
  onAnalyze,
  onTabChange,
  onViewAnalysis,
  onNewAnalysisComplete,
}) => {
  return (
    <div className="space-y-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Универсальный анализатор медицинских тестов</CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "input" && (
            <div className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Универсальный ИИ-анализатор:</strong> Система обрабатывает все типы медицинских анализов 
                  и автоматически сохраняет результаты в вашу историю.
                </AlertDescription>
              </Alert>

              <AnalysisInputMethods
                onAnalyze={onAnalyze}
                isAnalyzing={isAnalyzing}
              />
            </div>
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

      {/* История анализов внизу страницы */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">История ваших анализов</h2>
        
        {loadingHistory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <AnalysisHistory
            analysisHistory={analysisHistory}
            loadingHistory={false}
            onViewAnalysis={onViewAnalysis}
            onAddNewAnalysis={() => {}}
            onRefresh={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default NewAnalysisForm;
