
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";
import MedicalAnalysisForm from "@/components/medical-analysis/MedicalAnalysisForm";
import PhotoUploadCard from "./PhotoUploadCard";
import { usePhotoAnalysis } from "@/hooks/usePhotoAnalysis";

interface AnalysisInputMethodsProps {
  onAnalyze: (data: {
    text: string;
    photoUrl: string;
    inputMethod: "text" | "photo";
    analysisType: string;
  }) => Promise<void>;
  isAnalyzing: boolean;
}

const AnalysisInputMethods: React.FC<AnalysisInputMethodsProps> = ({
  onAnalyze,
  isAnalyzing
}) => {
  const { canUseFeature } = useSubscription();
  const [inputMethod, setInputMethod] = useState<"text" | "photo">("text");
  const {
    selectedPhoto,
    photoPreviewUrl,
    handlePhotoSelect,
    clearPhoto,
    convertToBase64
  } = usePhotoAnalysis();

  const canUsePhotoAnalysis = canUseFeature(FEATURES.PHOTO_BLOOD_ANALYSIS);

  const handleAnalyzePhoto = async () => {
    if (!selectedPhoto) return;
    
    try {
      const base64 = await convertToBase64();
      if (base64) {
        await onAnalyze({
          text: "",
          photoUrl: base64,
          inputMethod: "photo",
          analysisType: "blood"
        });
      }
    } catch (error) {
      console.error("Ошибка обработки фото:", error);
    }
  };

  return (
    <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as "text" | "photo")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="text" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Ввод текста
        </TabsTrigger>
        <TabsTrigger value="photo" disabled={!canUsePhotoAnalysis} className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Фото анализа
          {!canUsePhotoAnalysis && <span className="ml-2 text-xs">(Pro)</span>}
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
          <PhotoUploadCard
            selectedPhoto={selectedPhoto}
            photoPreviewUrl={photoPreviewUrl}
            onPhotoSelect={handlePhotoSelect}
            onPhotoRemove={clearPhoto}
            disabled={isAnalyzing}
          />
          
          {selectedPhoto && (
            <div className="flex justify-end">
              <Button
                onClick={handleAnalyzePhoto}
                disabled={isAnalyzing}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isAnalyzing ? "Анализирую..." : "Анализировать фото"}
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AnalysisInputMethods;
