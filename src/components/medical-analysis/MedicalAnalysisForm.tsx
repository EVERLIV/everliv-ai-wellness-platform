
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

  const handlePhotoSelect = (file: File) => {
    setSelectedPhoto(file);
    
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

    if (inputMethod === "text") {
      if (!text.trim()) {
        toast.error("Пожалуйста, введите результаты анализа");
        return;
      }
      await onAnalyze({ text, photoUrl: "", analysisType });
    } else if (inputMethod === "photo") {
      if (!selectedPhoto) {
        toast.error("Пожалуйста, загрузите фото анализа");
        return;
      }

      // Конвертируем файл в base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        await onAnalyze({ 
          text: "", 
          photoUrl: base64, 
          analysisType 
        });
      };
      reader.readAsDataURL(selectedPhoto);
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
