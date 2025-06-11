
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Camera } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadSectionProps {
  selectedPhoto: File | null;
  photoPreview: string;
  canUsePhotoAnalysis: boolean;
  isAnalyzing: boolean;
  onPhotoSelect: (file: File) => void;
  onRemovePhoto: () => void;
}

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  selectedPhoto,
  photoPreview,
  canUsePhotoAnalysis,
  isAnalyzing,
  onPhotoSelect,
  onRemovePhoto,
}) => {
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

    onPhotoSelect(file);
  };

  return (
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
                onClick={onRemovePhoto}
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
  );
};

export default PhotoUploadSection;
