
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImageIcon, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { FEATURES } from "@/constants/subscription-features";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MedicalAnalysisFormProps {
  onAnalyze: (data: { text: string, photoUrl: string, inputMethod: "text" | "photo", analysisType: string }) => void;
  isAnalyzing: boolean;
}

const ANALYSIS_TYPES = [
  { value: "blood", label: "Анализ крови" },
  { value: "urine", label: "Анализ мочи" },
  { value: "biochemistry", label: "Биохимический анализ" },
  { value: "hormones", label: "Гормональная панель" },
  { value: "vitamins", label: "Витамины и микроэлементы" },
  { value: "immunology", label: "Иммунологические исследования" },
  { value: "oncology", label: "Онкомаркеры" },
  { value: "cardiology", label: "Кардиологические маркеры" },
  { value: "other", label: "Другой тип анализа" }
];

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

  const getExampleText = (type: string) => {
    switch (type) {
      case "blood":
        return `Пример анализа крови:

Гемоглобин: 145 г/л
Эритроциты: 4.8×10¹²/л
Лейкоциты: 6.2×10⁹/л
Тромбоциты: 280×10⁹/л
СОЭ: 12 мм/ч`;

      case "urine":
        return `Пример анализа мочи:

Цвет: светло-желтый
Прозрачность: прозрачная
Плотность: 1.018
Белок: 0.025 г/л
Глюкоза: не обнаружена
Лейкоциты: 2-3 в п/з`;

      case "biochemistry":
        return `Пример биохимического анализа:

Глюкоза: 5.2 ммоль/л
Общий белок: 72 г/л
АЛТ: 28 Ед/л
АСТ: 24 Ед/л
Креатинин: 85 мкмоль/л
Мочевина: 6.2 ммоль/л`;

      case "hormones":
        return `Пример гормональной панели:

ТТГ: 2.8 мЕд/л
Т4 свободный: 14.2 пмоль/л
Т3 свободный: 4.8 пмоль/л
Кортизол: 425 нмоль/л
Инсулин: 8.5 мкЕд/мл`;

      default:
        return `Введите результаты вашего анализа:

Показатель: значение единица_измерения
Показатель: значение единица_измерения
...`;
    }
  };

  const selectedAnalysisType = ANALYSIS_TYPES.find(type => type.value === analysisType);

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
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Тип анализа
          </label>
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип анализа" />
            </SelectTrigger>
            <SelectContent>
              {ANALYSIS_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
                Результаты {selectedAnalysisType?.label.toLowerCase()}
              </label>
              <Textarea 
                placeholder={getExampleText(analysisType)}
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
                rows={12}
                className="resize-none font-mono text-sm"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="photo" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Загрузить фото {selectedAnalysisType?.label.toLowerCase()}
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Загрузите четкое фото или скан ваших результатов для автоматического распознавания
                </p>
                
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('medicalPhotoInput')?.click()}
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
                    id="medicalPhotoInput"
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
              
              {photoUrl && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Предварительный просмотр:</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img
                      src={photoUrl}
                      alt="Загруженные результаты анализа"
                      className="max-w-full max-h-64 mx-auto rounded shadow-sm"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {photoFile?.name} ({((photoFile?.size || 0) / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                </div>
              )}
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
