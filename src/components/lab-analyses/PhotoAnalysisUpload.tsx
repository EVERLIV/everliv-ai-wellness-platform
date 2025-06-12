
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Crown, Lock, Upload, X } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

interface PhotoAnalysisUploadProps {
  onPhotoSelect: (file: File) => void;
  isAnalyzing: boolean;
  disabled?: boolean;
  selectedPhoto?: File | null;
  photoPreviewUrl?: string;
  onPhotoRemove?: () => void;
}

const PhotoAnalysisUpload: React.FC<PhotoAnalysisUploadProps> = ({
  onPhotoSelect,
  isAnalyzing,
  disabled = false,
  selectedPhoto = null,
  photoPreviewUrl = "",
  onPhotoRemove = () => {}
}) => {
  const { subscription } = useSubscription();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const planType = subscription?.plan_type || 'basic';
  const hasPhotoAccess = planType === 'premium' || planType === 'basic';

  const validateFile = (file: File): boolean => {
    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      toast.error("Пожалуйста, выберите файл изображения");
      return false;
    }

    // Проверяем размер файла (максимум 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("Файл слишком большой. Максимальный размер: 10MB");
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!hasPhotoAccess) {
      toast.error("Функция загрузки фото недоступна для вашего плана");
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    onPhotoSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!hasPhotoAccess || disabled || isAnalyzing) {
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      toast.error("Пожалуйста, перетащите файл изображения");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!hasPhotoAccess) {
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
              <span className="font-medium text-gray-700">Требуется подписка</span>
            </div>
            <p className="text-gray-500 mb-4">
              Загружайте фото ваших анализов для автоматического распознавания показателей
            </p>
            <Button 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={() => toast.info("Перенаправление на страницу подписки...")}
            >
              <Crown className="h-4 w-4 mr-2" />
              Оформить подписку
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPremium = planType === 'premium';
  const limitText = isPremium 
    ? "15 анализов в месяц (текст + фото)" 
    : "1 фото-анализ в месяц";

  return (
    <Card className="border-dashed border-emerald-300 bg-emerald-50/50">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <Camera className="h-5 w-5 text-emerald-600" />
          Загрузка фото анализа
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-orange-100 px-2 py-1 rounded-full">
            <Crown className="h-3 w-3 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">
              {isPremium ? 'Premium' : 'Basic'}
            </span>
          </div>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">{limitText}</p>
      </CardHeader>
      <CardContent>
        {!selectedPhoto ? (
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-emerald-500 bg-emerald-100/50' 
                  : 'border-emerald-300 bg-emerald-50/30'
              } ${
                disabled || isAnalyzing 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer hover:border-emerald-400 hover:bg-emerald-100/30'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={!disabled && !isAnalyzing ? handleUploadClick : undefined}
            >
              <Camera className={`h-12 w-12 mx-auto mb-4 ${
                isDragOver ? 'text-emerald-600' : 'text-emerald-400'
              }`} />
              
              {isDragOver ? (
                <p className="text-sm text-emerald-700 font-medium mb-4">
                  Отпустите файл для загрузки
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Перетащите фото сюда или нажмите для выбора файла
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Поддерживаются форматы: JPG, PNG, WEBP (до 10MB)
                  </p>
                </>
              )}
              
              <Button
                type="button"
                variant="outline"
                disabled={disabled || isAnalyzing}
                className="flex items-center gap-2 pointer-events-none"
              >
                {isAnalyzing ? (
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
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={disabled || isAnalyzing}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative border-2 border-emerald-200 rounded-lg p-4 bg-emerald-50/30">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onPhotoRemove}
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white hover:bg-gray-100 rounded-full shadow-sm z-10"
              >
                <X className="h-4 w-4" />
              </Button>
              {photoPreviewUrl && (
                <img
                  src={photoPreviewUrl}
                  alt="Предварительный просмотр анализа"
                  className="max-w-full max-h-64 mx-auto rounded shadow-sm"
                />
              )}
              <p className="text-xs text-gray-500 text-center mt-2">
                {selectedPhoto.name} ({((selectedPhoto.size || 0) / 1024).toFixed(1)} KB)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoAnalysisUpload;
