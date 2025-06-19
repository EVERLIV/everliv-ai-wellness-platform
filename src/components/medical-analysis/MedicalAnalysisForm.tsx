
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, Loader2 } from 'lucide-react';
import TestDateSelector from '@/components/lab-analyses/TestDateSelector';
import SecureFileUpload from '@/components/security/SecureFileUpload';

interface MedicalAnalysisFormProps {
  onAnalyze: (data: { 
    text: string; 
    photoUrl: string; 
    inputMethod: "text" | "photo";
    analysisType: string;
    testDate?: string;
  }) => Promise<void>;
  isAnalyzing: boolean;
}

const ANALYSIS_TYPES = [
  { value: 'Общий анализ крови', label: 'Общий анализ крови' },
  { value: 'Биохимический анализ крови', label: 'Биохимический анализ крови' },
  { value: 'Липидный профиль', label: 'Липидный профиль' },
  { value: 'Гормональный анализ', label: 'Гормональный анализ' },
  { value: 'Анализ на витамины', label: 'Анализ на витамины' },
  { value: 'Общий анализ мочи', label: 'Общий анализ мочи' },
  { value: 'Иммунологический анализ', label: 'Иммунологический анализ' },
  { value: 'Онкомаркеры', label: 'Онкомаркеры' },
  { value: 'Коагулограмма', label: 'Коагулограмма' },
  { value: 'Другой', label: 'Другой тип анализа' }
];

const MedicalAnalysisForm: React.FC<MedicalAnalysisFormProps> = ({
  onAnalyze,
  isAnalyzing
}) => {
  const [inputMethod, setInputMethod] = useState<"text" | "photo">("text");
  const [textInput, setTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [analysisType, setAnalysisType] = useState("");
  const [testDate, setTestDate] = useState<Date>();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  const handleAnalyze = async () => {
    if (!analysisType) {
      return;
    }

    await onAnalyze({
      text: textInput,
      photoUrl: photoUrl,
      inputMethod: inputMethod,
      analysisType: analysisType,
      testDate: testDate?.toISOString().split('T')[0]
    });
  };

  const canAnalyze = analysisType && (
    (inputMethod === "text" && textInput.trim()) ||
    (inputMethod === "photo" && selectedFile)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Новый анализ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Выбор типа анализа */}
        <div className="space-y-2">
          <Label htmlFor="analysis-type">Тип анализа</Label>
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

        {/* Выбор даты анализа */}
        <TestDateSelector
          selectedDate={testDate}
          onDateChange={setTestDate}
        />

        {/* Способ ввода данных */}
        <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as "text" | "photo")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Ввод текстом</TabsTrigger>
            <TabsTrigger value="photo">Загрузка фото</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Результаты анализа</Label>
              <Textarea
                id="text-input"
                placeholder="Введите результаты вашего анализа..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="photo" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Фото результатов анализа</Label>
              <SecureFileUpload
                onFileSelect={handleFileSelect}
                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                maxSize={10 * 1024 * 1024} // 10MB
                accept="image/*"
              />
              {selectedFile && (
                <div className="text-sm text-green-600">
                  Выбран файл: {selectedFile.name}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="w-full"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Анализируем...
            </>
          ) : (
            <>
              {inputMethod === "photo" ? (
                <Camera className="mr-2 h-4 w-4" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Анализировать результаты
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MedicalAnalysisForm;
