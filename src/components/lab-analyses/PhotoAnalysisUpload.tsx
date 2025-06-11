
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Crown, Lock } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

interface PhotoAnalysisUploadProps {
  onPhotoSelect: (file: File) => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

const PhotoAnalysisUpload: React.FC<PhotoAnalysisUploadProps> = ({
  onPhotoSelect,
  isAnalyzing,
  disabled = false
}) => {
  const { subscription } = useSubscription();
  const [dragActive, setDragActive] = useState(false);
  
  const isPremium = subscription?.plan_type === 'premium' || subscription?.plan_type === 'standard';

  const handleFileSelect = (file: File) => {
    if (!isPremium) {
      toast.error("Функция загрузки фото доступна только для Premium подписки");
      return;
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    // Проверяем размер файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 10MB");
      return;
    }

    onPhotoSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (!isPremium || disabled || isAnalyzing) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  if (!isPremium) {
    return (
      <Card className="border-dashed border-gray-300 bg-gray-50/50">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg flex items-center justify-center gap-2">
            <Lock className="h-5 w-5 text-gray-400" />
            Загрузка фото анализа
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="py-8">
            <Camera className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-gray-700">Premium функция</span>
            </div>
            <p className="text-gray-500 mb-4">
              Загружайте фото ваших анализов для автоматического распознавания показателей
            </p>
            <Button 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={() => toast.info("Перенаправление на страницу подписки...")}
            >
              <Crown className="h-4 w-4 mr-2" />
              Получить Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-emerald-300 bg-emerald-50/50">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <Camera className="h-5 w-5 text-emerald-600" />
          Загрузка фото анализа
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-orange-100 px-2 py-1 rounded-full">
            <Crown className="h-3 w-3 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">Pro</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? 'border-emerald-400 bg-emerald-100' : 'border-emerald-300 hover:border-emerald-400'}
            ${disabled || isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isAnalyzing) setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
        >
          <Upload className="h-12 w-12 mx-auto text-emerald-400 mb-4" />
          <p className="text-gray-600 mb-4">
            Перетащите фото анализа сюда или нажмите для выбора
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Поддерживаются форматы: JPG, PNG, WebP (до 10MB)
          </p>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            id="photo-upload"
            disabled={disabled || isAnalyzing}
          />
          
          <Button
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            onClick={() => document.getElementById('photo-upload')?.click()}
            disabled={disabled || isAnalyzing}
          >
            {isAnalyzing ? "Обработка..." : "Выбрать фото"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoAnalysisUpload;
