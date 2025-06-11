
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";
import { toast } from "sonner";
import AnalysisTypeSelector from "./AnalysisTypeSelector";
import InputMethodTabs from "./InputMethodTabs";

interface MedicalAnalysisFormProps {
  onAnalyze: (data: { text: string; photoUrl: string; analysisType: string }) => Promise<void>;
  isAnalyzing: boolean;
}

const MedicalAnalysisForm: React.FC<MedicalAnalysisFormProps> = ({
  onAnalyze,
  isAnalyzing,
}) => {
  const [text, setText] = useState("");
  const [analysisType, setAnalysisType] = useState("blood");
  const [inputMethod, setInputMethod] = useState<"text" | "photo">("text");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const { canUseFeature } = useSubscription();
  const canUsePhotoAnalysis = canUseFeature(FEATURES.PHOTO_BLOOD_ANALYSIS);

  console.log("MedicalAnalysisForm - Photo analysis access:", canUsePhotoAnalysis);

  const handlePhotoSelect = (file: File) => {
    setSelectedPhoto(file);
    
    // Создаем превью
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submission:", { inputMethod, hasText: !!text.trim(), hasPhoto: !!selectedPhoto });

    if (inputMethod === "text") {
      if (!text.trim()) {
        toast.error("Пожалуйста, введите результаты анализа");
        return;
      }
      console.log("Submitting text analysis:", text.substring(0, 50) + "...");
      await onAnalyze({ text, photoUrl: "", analysisType });
    } else if (inputMethod === "photo") {
      if (!selectedPhoto) {
        toast.error("Пожалуйста, загрузите фото анализа");
        return;
      }

      console.log("Submitting photo analysis:", selectedPhoto.name);

      // Конвертируем файл в base64 синхронно
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedPhoto);
        });
        
        console.log("Photo converted to base64, starting analysis...");
        await onAnalyze({ 
          text: "", 
          photoUrl: base64, 
          analysisType 
        });
      } catch (error) {
        console.error("Error converting photo to base64:", error);
        toast.error("Ошибка при обработке фото");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <AnalysisTypeSelector
          value={analysisType}
          onChange={setAnalysisType}
        />

        <InputMethodTabs
          inputMethod={inputMethod}
          onInputMethodChange={setInputMethod}
          text={text}
          onTextChange={setText}
          selectedPhoto={selectedPhoto}
          photoPreview={photoPreview}
          canUsePhotoAnalysis={canUsePhotoAnalysis}
          isAnalyzing={isAnalyzing}
          onPhotoSelect={handlePhotoSelect}
          onRemovePhoto={removePhoto}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isAnalyzing}
      >
        {isAnalyzing ? "Анализирую..." : "Анализировать"}
      </Button>
    </form>
  );
};

export default MedicalAnalysisForm;
