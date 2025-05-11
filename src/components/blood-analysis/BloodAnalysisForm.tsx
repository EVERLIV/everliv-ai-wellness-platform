
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { FEATURES } from "@/constants/subscription-features";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface BloodAnalysisFormProps {
  onAnalyze: (data: { text: string, photoUrl: string, inputMethod: "text" | "photo" }) => void;
  isAnalyzing: boolean;
}

const BloodAnalysisForm = ({ onAnalyze, isAnalyzing }: BloodAnalysisFormProps) => {
  const [bloodText, setBloodText] = useState("");
  const [bloodPhotoUrl, setBloodPhotoUrl] = useState("");
  const [bloodPhotoFile, setBloodPhotoFile] = useState<File | null>(null);
  const [selectedInputMethod, setSelectedInputMethod] = useState<"text" | "photo">("text");
  const { canUseFeature } = useSubscription();
  const canUsePhotoAnalysis = canUseFeature(FEATURES.PHOTO_BLOOD_ANALYSIS);
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size - limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Файл слишком большой. Максимальный размер - 5MB");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Пожалуйста, загрузите файл изображения");
      return;
    }
    
    setBloodPhotoFile(file);
    const url = URL.createObjectURL(file);
    setBloodPhotoUrl(url);
    setSelectedInputMethod("photo");
    toast.success("Фото загружено");
  };

  const handleSubmit = () => {
    if (selectedInputMethod === "text" && !bloodText.trim()) {
      toast.error("Пожалуйста, введите результаты анализа крови");
      return;
    }

    if (selectedInputMethod === "photo" && !bloodPhotoUrl) {
      toast.error("Пожалуйста, загрузите фото результатов анализа");
      return;
    }

    // Log some information about the file
    if (bloodPhotoFile) {
      console.log("Submitting file:", {
        name: bloodPhotoFile.name,
        type: bloodPhotoFile.type,
        size: `${(bloodPhotoFile.size / 1024).toFixed(2)} KB`
      });
    }

    onAnalyze({
      text: bloodText,
      photoUrl: bloodPhotoUrl,
      inputMethod: selectedInputMethod
    });
  };

  return (
    <>
      <div className="space-y-4">
        <Tabs defaultValue={selectedInputMethod} onValueChange={(value) => setSelectedInputMethod(value as "text" | "photo")}>
          <TabsList>
            <TabsTrigger value="text">Ввод текста</TabsTrigger>
            <TabsTrigger value="photo" disabled={!canUsePhotoAnalysis}>
              Фото анализа
              {!canUsePhotoAnalysis && <span className="ml-2 text-xs">(Требуется подписка)</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="pt-4">
            <p className="mb-2 text-sm text-gray-500">
              Введите результаты вашего анализа крови в свободной форме или скопируйте из файла
            </p>
            <Textarea 
              placeholder="Например: Гемоглобин: 142 г/л, Эритроциты: 4.7 млн/мкл, Лейкоциты: 10.2 тыс/мкл..."
              value={bloodText}
              onChange={(e) => setBloodText(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </TabsContent>
          
          <TabsContent value="photo" className="pt-4">
            <div className="space-y-4">
              <div>
                <p className="mb-4 text-sm text-gray-500">
                  Загрузите фото или скан вашего анализа крови для автоматического распознавания результатов с помощью AI
                </p>
                
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('bloodPhotoInput')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Загрузить фото
                  </Button>
                  <input
                    id="bloodPhotoInput"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              {bloodPhotoUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Загруженное фото:</p>
                  <div className="border rounded-md p-2 bg-gray-50 max-w-sm">
                    <img
                      src={bloodPhotoUrl}
                      alt="Загруженные результаты анализа"
                      className="max-w-full rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={isAnalyzing || (selectedInputMethod === "text" && !bloodText.trim()) || (selectedInputMethod === "photo" && !bloodPhotoUrl)}
        >
          {isAnalyzing ? "Анализируем..." : "Анализировать"}
        </Button>
      </div>
    </>
  );
};

export default BloodAnalysisForm;
