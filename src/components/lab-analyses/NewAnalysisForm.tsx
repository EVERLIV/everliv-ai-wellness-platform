
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Camera } from "lucide-react";
import MedicalAnalysisForm from "@/components/medical-analysis/MedicalAnalysisForm";
import MedicalAnalysisResults from "@/components/medical-analysis/MedicalAnalysisResults";
import PhotoAnalysisUpload from "./PhotoAnalysisUpload";
import AnalysisHistory from "./AnalysisHistory";

interface NewAnalysisFormProps {
  activeTab: string;
  results: any;
  isAnalyzing: boolean;
  apiError: any;
  analysisHistory: any[];
  loadingHistory: boolean;
  onBack: () => void;
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
  onBack,
  onAnalyze,
  onTabChange,
  onViewAnalysis,
  onNewAnalysisComplete,
}) => {
  const [inputMethod, setInputMethod] = useState<"text" | "photo">("text");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const handlePhotoSelect = (file: File) => {
    setSelectedPhoto(file);
    setInputMethod("photo");
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedPhoto) return;
    
    // Конвертируем файл в base64 для передачи
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await onAnalyze({
        text: "",
        photoUrl: base64,
        inputMethod: "photo",
        analysisType: "blood"
      });
    };
    reader.readAsDataURL(selectedPhoto);
  };

  return (
    <div className="space-y-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Универсальный анализатор медицинских тестов</CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "input" && (
            <div className="space-y-6">
              <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as "text" | "photo")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Ввод текста
                  </TabsTrigger>
                  <TabsTrigger value="photo" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Фото анализа
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-6">
                  <MedicalAnalysisForm 
                    onAnalyze={(data) => onAnalyze({...data, inputMethod: "text"})}
                    isAnalyzing={isAnalyzing}
                  />
                </TabsContent>
                
                <TabsContent value="photo" className="mt-6">
                  <div className="space-y-4">
                    <PhotoAnalysisUpload
                      onPhotoSelect={handlePhotoSelect}
                      isAnalyzing={isAnalyzing}
                    />
                    
                    {selectedPhoto && (
                      <Card className="bg-emerald-50 border-emerald-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Camera className="h-5 w-5 text-emerald-600" />
                              <div>
                                <p className="font-medium text-emerald-900">{selectedPhoto.name}</p>
                                <p className="text-sm text-emerald-700">
                                  {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={handleAnalyzePhoto}
                              disabled={isAnalyzing}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              {isAnalyzing ? "Анализирую..." : "Анализировать"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
        ) : analysisHistory.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-600">История анализов появится здесь после их обработки</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisHistory.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-xl">
                        {analysis.results?.riskLevel === 'high' ? "🔴" : 
                         analysis.results?.riskLevel === 'medium' ? "🟡" : "🟢"}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {analysis.analysis_type === 'blood' ? 'Анализ крови' : analysis.analysis_type}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <span>{new Date(analysis.created_at).toLocaleDateString('ru-RU')}</span>
                          {analysis.input_method === 'photo' && (
                            <div className="flex items-center gap-1 ml-2">
                              <Camera className="h-3 w-3 text-emerald-500" />
                              <span className="text-emerald-600">Фото</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-sm font-bold text-green-600">
                          {analysis.results?.markers?.filter(m => m.status === 'normal').length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Норма</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-red-600">
                          {analysis.results?.markers?.filter(m => m.status !== 'normal').length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Отклонения</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-700">
                          {analysis.results?.markers?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Всего</div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 text-xs"
                    onClick={() => onViewAnalysis(analysis.id)}
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAnalysisForm;
