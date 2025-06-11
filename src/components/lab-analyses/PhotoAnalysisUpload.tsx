
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Crown, Lock } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import PhotoUploadCard from "./PhotoUploadCard";

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
  
  const isPremium = subscription?.plan_type === 'premium' || subscription?.plan_type === 'standard';

  const handleFileSelect = (file: File) => {
    if (!isPremium) {
      toast.error("Функция загрузки фото доступна только для Premium подписки");
      return;
    }
    onPhotoSelect(file);
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
        <PhotoUploadCard
          selectedPhoto={selectedPhoto}
          photoPreviewUrl={photoPreviewUrl}
          onPhotoSelect={handleFileSelect}
          onPhotoRemove={onPhotoRemove}
          disabled={disabled || isAnalyzing}
        />
      </CardContent>
    </Card>
  );
};

export default PhotoAnalysisUpload;
