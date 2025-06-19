
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Camera, Loader2 } from "lucide-react";
import TextInputSection from "./TextInputSection";
import PhotoInputSection from "./PhotoInputSection";

interface MedicalAnalysisFormProps {
  onAnalyze: (data: {
    text: string;
    photoUrl: string;
    inputMethod: "text" | "photo";
    analysisType: string;
  }) => Promise<void>;
  isAnalyzing: boolean;
}

const MedicalAnalysisForm: React.FC<MedicalAnalysisFormProps> = ({
  onAnalyze,
  isAnalyzing
}) => {
  const [inputMethod, setInputMethod] = useState<"text" | "photo">("text");
  const [textInput, setTextInput] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const handleAnalyze = async () => {
    if (inputMethod === "text" && !textInput.trim()) {
      return;
    }
    if (inputMethod === "photo" && !photoUrl.trim()) {
      return;
    }

    // Автоматически определяем тип анализа как "Анализ крови"
    await onAnalyze({
      text: textInput,
      photoUrl: photoUrl,
      inputMethod: inputMethod,
      analysisType: "blood_analysis" // Системно определенный тип
    });
  };

  const isFormValid = inputMethod === "text" ? textInput.trim().length > 0 : photoUrl.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Анализ медицинских данных
        </CardTitle>
        <p className="text-sm text-gray-600">
          Введите данные анализов или загрузите фото. Тип анализа определяется автоматически.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as "text" | "photo")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Текст
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Фото
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-4">
            <TextInputSection
              value={textInput}
              onChange={setTextInput}
            />
          </TabsContent>

          <TabsContent value="photo" className="mt-4">
            <PhotoInputSection
              photoUrl={photoUrl}
              onPhotoUrlChange={setPhotoUrl}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleAnalyze}
            disabled={!isFormValid || isAnalyzing}
            className="min-w-32"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Анализируем...
              </>
            ) : (
              "Анализировать"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalAnalysisForm;
