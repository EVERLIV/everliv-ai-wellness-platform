
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Camera, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeBloodTestWithOpenAI } from '@/services/ai/blood-test-analysis';
import { getBiomarkerImpact } from '@/services/ai/biomarker-impact-analysis';
import AnalysisPreview from './AnalysisPreview';

interface CategoryAnalysisUploadProps {
  category: string;
  categoryTitle: string;
  onAnalysisComplete: (biomarkerData: any[]) => void;
}

const CategoryAnalysisUpload: React.FC<CategoryAnalysisUploadProps> = ({
  category,
  categoryTitle,
  onAnalysisComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 10МБ');
        return;
      }
      setSelectedImage(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    setIsAnalyzing(true);

    try {
      const imageBase64 = await convertFileToBase64(selectedImage);
      
      const result = await analyzeBloodTestWithOpenAI({
        imageBase64: imageBase64
      });

      // Обогащаем результаты информацией о влиянии на биологический возраст
      const enrichedResults = result.markers.map(marker => {
        const impact = getBiomarkerImpact(marker.name);
        return {
          ...marker,
          category,
          categoryTitle,
          impact: impact.impact,
          impactDescription: impact.description
        };
      });

      setAnalysisResults(enrichedResults);
      setShowPreview(true);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Ошибка при анализе изображения. Попробуйте еще раз.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAnalysis = () => {
    if (analysisResults) {
      onAnalysisComplete(analysisResults);
      setIsOpen(false);
      setShowPreview(false);
      setSelectedImage(null);
      setAnalysisResults(null);
      toast.success(`Анализ ${categoryTitle} успешно обработан!`);
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setAnalysisResults(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowPreview(false);
    setSelectedImage(null);
    setAnalysisResults(null);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Добавить анализ
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить анализ: {categoryTitle}</DialogTitle>
          </DialogHeader>
          
          {!showPreview ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Camera className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Загрузите фото анализа</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Наш ИИ автоматически распознает биомаркеры {categoryTitle.toLowerCase()} и оценит их влияние на биологический возраст
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Выбрать изображение
                    </Button>

                    {selectedImage && (
                      <div className="text-sm text-green-600">
                        Выбран файл: {selectedImage.name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                  disabled={isAnalyzing}
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isAnalyzing}
                  className="flex-1 gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Анализирую...
                    </>
                  ) : (
                    'Анализировать'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <AnalysisPreview
              biomarkers={analysisResults || []}
              onConfirm={handleConfirmAnalysis}
              onCancel={handleCancelPreview}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryAnalysisUpload;
