
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImageIcon, AlertCircle, Info } from "lucide-react";
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
      // Check file size - limit to 10MB
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Файл слишком большой. Максимальный размер - 10MB");
        toast.error("Файл слишком большой. Максимальный размер - 10MB");
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
      
      console.log("Image uploaded:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      toast.success("Фото успешно загружено");
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

    console.log("Submitting analysis request:", {
      method: selectedInputMethod,
      hasText: selectedInputMethod === "text" && bloodText.length > 0,
      hasPhoto: selectedInputMethod === "photo" && bloodPhotoUrl.length > 0,
      fileInfo: bloodPhotoFile ? {
        name: bloodPhotoFile.name,
        type: bloodPhotoFile.type,
        size: `${(bloodPhotoFile.size / 1024).toFixed(2)} KB`
      } : null
    });

    onAnalyze({
      text: bloodText,
      photoUrl: bloodPhotoUrl,
      inputMethod: selectedInputMethod
    });
  };

  const exampleText = `Пример анализа крови:

Гемоглобин: 145 г/л
Эритроциты: 4.8×10¹²/л
Лейкоциты: 6.2×10⁹/л
Тромбоциты: 280×10⁹/л
СОЭ: 12 мм/ч

Глюкоза: 5.2 ммоль/л
Общий белок: 72 г/л
АЛТ: 28 Ед/л
АСТ: 24 Ед/л
Креатинин: 85 мкмоль/л`;

  const tips = {
    photo: [
      "Убедитесь, что текст на фото четкий и хорошо читаемый",
      "Фотографируйте под прямым углом, избегая теней и бликов",
      "Проверьте, что видны все значения и единицы измерения",
      "При плохом качестве фото лучше ввести данные вручную"
    ],
    text: [
      "Включите названия показателей, их значения и единицы измерения",
      "Добавьте референсные значения, если они указаны в анализе",
      "Можно копировать данные прямо из электронного результата",
      "Структурируйте данные по строкам для лучшего распознавания"
    ]
  };

  return (
    <>
      <div className="space-y-6">
        {/* API Key Notice */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Информация:</strong> Анализ крови работает через защищенное соединение с OpenAI. 
            Все данные обрабатываются конфиденциально и не сохраняются.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue={selectedInputMethod} onValueChange={(value) => setSelectedInputMethod(value as "text" | "photo")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Ввод текста</TabsTrigger>
            <TabsTrigger value="photo" disabled={!canUsePhotoAnalysis}>
              Анализ фото
              {!canUsePhotoAnalysis && <span className="ml-2 text-xs">(Pro)</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Результаты анализа крови
              </label>
              <Textarea 
                placeholder={exampleText}
                value={bloodText}
                onChange={(e) => setBloodText(e.target.value)}
                rows={12}
                className="resize-none font-mono text-sm"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Советы для точного анализа:
              </h4>
              <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                {tips.text.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="photo" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Загрузить фото анализа
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Загрузите четкое фото или скан вашего анализа крови для автоматического распознавания с помощью ИИ
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
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Выбрать файл
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Предварительный просмотр:</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img
                      src={bloodPhotoUrl}
                      alt="Загруженные результаты анализа"
                      className="max-w-full max-h-64 mx-auto rounded shadow-sm"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {bloodPhotoFile?.name} ({(bloodPhotoFile?.size || 0 / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Требования к фото:
                </h4>
                <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                  {tips.photo.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end pt-6 border-t">
        <Button 
          onClick={handleSubmit} 
          disabled={
            isAnalyzing || 
            photoUploading || 
            (selectedInputMethod === "text" && !bloodText.trim()) || 
            (selectedInputMethod === "photo" && !bloodPhotoUrl)
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
    </>
  );
};

export default BloodAnalysisForm;
