
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Camera, Upload, X } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";
import { toast } from "sonner";

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

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем размер файла (максимум 10 МБ)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 10 МБ");
      return;
    }

    // Проверяем тип файла
    if (!file.type.startsWith("image/")) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

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

    if (inputMethod === "text") {
      if (!text.trim()) {
        toast.error("Пожалуйста, введите результаты анализа");
        return;
      }
      await onAnalyze({ text, photoUrl: "", analysisType });
    } else {
      if (!selectedPhoto) {
        toast.error("Пожалуйста, загрузите фото анализа");
        return;
      }
      
      if (!canUsePhotoAnalysis) {
        toast.error("Анализ фото доступен только в Premium подписке");
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
        <div>
          <Label htmlFor="analysisType">Тип анализа</Label>
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип анализа" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blood">Анализ крови</SelectItem>
              <SelectItem value="urine">Анализ мочи</SelectItem>
              <SelectItem value="biochemistry">Биохимический анализ</SelectItem>
              <SelectItem value="hormones">Гормональный анализ</SelectItem>
              <SelectItem value="vitamins">Анализ витаминов</SelectItem>
              <SelectItem value="other">Другой анализ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as "text" | "photo")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ввод текста
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Фото анализа
              {!canUsePhotoAnalysis && (
                <span className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2 py-0.5 rounded-full ml-1">
                  Pro
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-4">
            <div>
              <Label htmlFor="analysisText">Результаты анализа</Label>
              <Textarea
                id="analysisText"
                placeholder="Введите результаты вашего анализа..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] mt-2"
                disabled={isAnalyzing}
              />
            </div>
          </TabsContent>

          <TabsContent value="photo" className="mt-4">
            <div className="space-y-4">
              {!canUsePhotoAnalysis && (
                <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                        <Camera className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-900">Функция Pro</p>
                        <p className="text-sm text-amber-700">
                          Анализ фото доступен только в Premium подписке
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {!selectedPhoto ? (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label
                        htmlFor="photo-upload"
                        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                          canUsePhotoAnalysis 
                            ? "bg-emerald-600 hover:bg-emerald-700" 
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Загрузить фото
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        disabled={!canUsePhotoAnalysis || isAnalyzing}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, JPEG до 10 МБ
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Предварительный просмотр"
                        className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white"
                        onClick={removePhoto}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{selectedPhoto.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedPhoto.size / 1024 / 1024).toFixed(2)} МБ
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isAnalyzing || (inputMethod === "photo" && !canUsePhotoAnalysis)}
      >
        {isAnalyzing ? "Анализирую..." : "Анализировать"}
      </Button>
    </form>
  );
};

export default MedicalAnalysisForm;
