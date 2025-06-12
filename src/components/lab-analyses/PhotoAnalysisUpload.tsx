
import React from "react";
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
  
  const planType = subscription?.plan_type || 'basic';
  const hasPhotoAccess = planType === 'premium' || planType === 'basic';

  const handleFileSelect = (file: File) => {
    if (!hasPhotoAccess) {
      toast.error("Функция загрузки фото недоступна для вашего плана");
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
            <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50/30">
              <Camera className="h-12 w-12 mx-auto text-emerald-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Загрузите четкое фото или скан ваших результатов анализа
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo-upload-input')?.click()}
                disabled={disabled || isAnalyzing}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Выбрать файл
              </Button>
              <input
                id="photo-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
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
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white hover:bg-gray-100 rounded-full shadow-sm"
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
