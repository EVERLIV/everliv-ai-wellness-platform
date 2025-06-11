
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { FEATURES } from "@/constants/subscription-features";
import { useSubscription } from "@/contexts/SubscriptionContext";
import AnalysisTypeSelector from "./AnalysisTypeSelector";
import TextInputSection from "./TextInputSection";
import PhotoInputSection from "./PhotoInputSection";

interface MedicalAnalysisFormProps {
  onAnalyze: (data: { text: string, photoUrl: string, inputMethod: "text" | "photo", analysisType: string }) => void;
  isAnalyzing: boolean;
}

const MedicalAnalysisForm = ({ onAnalyze, isAnalyzing }: MedicalAnalysisFormProps) => {
  const [analysisText, setAnalysisText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedInputMethod, setSelectedInputMethod] = useState<"text" | "photo">("text");
  const [analysisType, setAnalysisType] = useState("blood");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const { canUseFeature } = useSubscription();
  const canUsePhotoAnalysis = canUseFeature(FEATURES.PHOTO_BLOOD_ANALYSIS);
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadError(null);
    setPhotoUploading(true);
    
    try {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Файл слишком большой. Максимальный размер - 10MB");
        toast.error("Файл слишком большой. Максимальный размер - 10MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setUploadError("Пожалуйста, загрузите файл изображения");
        toast.error("Пожалуйста, загрузите файл изображения");
        return;
      }
      
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      setSelectedInputMethod("photo");
      
      console.log("Изображение загружено:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`
      });
      
      toast.success("Фото успешно загружено");
    } catch (error) {
      console.error("Ошибка при загрузке фото:", error);
      setUploadError("Ошибка при загрузке фото. Пожалуйста, попробуйте еще раз.");
      toast.error("Ошибка при загрузке фото");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedInputMethod === "text" && !analysisText.trim()) {
      toast.error("Пожалуйста, введите результаты анализа");
      return;
    }

    if (selectedInputMethod === "photo" && !photoUrl) {
      toast.error("Пожалуйста, загрузите фото результатов анализа");
      return;
    }

    if (!analysisType) {
      toast.error("Пожалуйста, выберите тип анализа");
      return;
    }

    console.log("Отправляем запрос на анализ:", {
      method: selectedInputMethod,
      analysisType,
      hasText: selectedInputMethod === "text" && analysisText.length > 0,
      hasPhoto: selectedInputMethod === "photo" && photoUrl.length > 0
    });

    onAnalyze({
      text: analysisText,
      photoUrl: photoUrl,
      inputMethod: selectedInputMethod,
      analysisType
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Универсальный ИИ-анализатор:</strong> Система обрабатывает все типы медицинских анализов 
          и автоматически сохраняет результаты в вашу историю.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <AnalysisTypeSelector
          value={analysisType}
          onChange={setAnalysisType}
        />

        <Tabs defaultValue={selectedInputMethod} onValueChange={(value) => setSelectedInputMethod(value as "text" | "photo")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Ввод текста</TabsTrigger>
            <TabsTrigger value="photo" disabled={!canUsePhotoAnalysis}>
              Анализ фото
              {!canUsePhotoAnalysis && <span className="ml-2 text-xs">(Pro)</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <TextInputSection
              value={analysisText}
              onChange={setAnalysisText}
              analysisType={analysisType}
            />
          </TabsContent>
          
          <TabsContent value="photo" className="space-y-4">
            <PhotoInputSection
              photoFile={photoFile}
              photoUrl={photoUrl}
              analysisType={analysisType}
              photoUploading={photoUploading}
              uploadError={uploadError}
              onPhotoUpload={handlePhotoUpload}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end pt-6 border-t">
        <Button 
          onClick={handleSubmit} 
          disabled={
            isAnalyzing || 
            photoUploading || 
            !analysisType ||
            (selectedInputMethod === "text" && !analysisText.trim()) || 
            (selectedInputMethod === "photo" && !photoUrl)
          }
          className="min-w-32"
          size="lg"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Анализируем...
            </span>
          ) : "Начать анализ"}
        </Button>
      </div>
    </div>
  );
};

export default MedicalAnalysisForm;
