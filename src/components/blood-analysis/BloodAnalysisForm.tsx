
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FEATURES } from "@/constants/subscription-features";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BloodAnalysisFormProps {
  onAnalyze: (data: { text: string, photoUrl: string, inputMethod: "text" | "photo" }) => void;
  isAnalyzing: boolean;
}

const BloodAnalysisForm = ({ onAnalyze, isAnalyzing }: BloodAnalysisFormProps) => {
  const [bloodText, setBloodText] = useState("");
  const [bloodPhotoUrl, setBloodPhotoUrl] = useState("");
  const [bloodPhotoFile, setBloodPhotoFile] = useState<File | null>(null);
  const [selectedInputMethod, setSelectedInputMethod] = useState<"text" | "photo">("text");
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
      // Check file size - limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Файл слишком большой. Максимальный размер - 5MB");
        toast.error("Файл слишком большой. Максимальный размер - 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError("Пожалуйста, загрузите файл изображения");
        toast.error("Пожалуйста, загрузите файл изображения");
        return;
      }
      
      setBloodPhotoFile(file);
      const url = URL.createObjectURL(file);
      setBloodPhotoUrl(url);
      setSelectedInputMethod("photo");
      
      // Log image information
      console.log("Image uploaded:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      toast.success("Фото загружено");
    } catch (error) {
      console.error("Error during photo upload:", error);
      setUploadError("Ошибка при загрузке фото. Пожалуйста, попробуйте еще раз.");
      toast.error("Ошибка при загрузке фото");
    } finally {
      setPhotoUploading(false);
    }
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

  const tips = {
    photo: [
      "Для лучших результатов убедитесь, что текст на фото четкий и хорошо освещенный",
      "Фотографируйте под прямым углом, избегая искажений",
      "Убедитесь, что видны все значения и их единицы измерения"
    ],
    text: [
      "Копируйте все показатели с их значениями и единицами измерения",
      "Для каждого показателя укажите нормальный диапазон, если он известен",
      "Можно структурировать текст по строкам для лучшего распознавания"
    ]
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
            
            <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Советы для лучшего результата:</h4>
              <ul className="list-disc pl-5 text-xs text-blue-600 space-y-1">
                {tips.text.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
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
                    disabled={photoUploading}
                  >
                    {photoUploading ? (
                      <span>Загрузка...</span>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Загрузить фото
                      </>
                    )}
                  </Button>
                  <input
                    id="bloodPhotoInput"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                
                {uploadError && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
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
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <h4 className="text-sm font-medium text-blue-700 mb-2">Советы для лучшего распознавания:</h4>
                <ul className="list-disc pl-5 text-xs text-blue-600 space-y-1">
                  {tips.photo.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={isAnalyzing || photoUploading || (selectedInputMethod === "text" && !bloodText.trim()) || (selectedInputMethod === "photo" && !bloodPhotoUrl)}
          className="relative"
        >
          {isAnalyzing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Анализируем...
            </span>
          ) : "Анализировать"}
        </Button>
      </div>
    </>
  );
};

export default BloodAnalysisForm;
