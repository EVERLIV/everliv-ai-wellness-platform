
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";

interface PhotoUploadCardProps {
  selectedPhoto: File | null;
  photoPreviewUrl: string;
  onPhotoSelect: (file: File) => void;
  onPhotoRemove: () => void;
  disabled?: boolean;
}

const PhotoUploadCard: React.FC<PhotoUploadCardProps> = ({
  selectedPhoto,
  photoPreviewUrl,
  onPhotoSelect,
  onPhotoRemove,
  disabled = false
}) => {
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      onPhotoSelect(file);
    }
  };

  if (selectedPhoto && photoPreviewUrl) {
    return (
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">{selectedPhoto.name}</p>
                  <p className="text-sm text-emerald-700">
                    {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPhotoRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="border-2 border-dashed border-emerald-300 rounded-lg p-4 bg-white">
              <img
                src={photoPreviewUrl}
                alt="Предварительный просмотр анализа"
                className="max-w-full max-h-64 mx-auto rounded shadow-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-emerald-300 bg-emerald-50/50">
      <CardContent className="p-6">
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${disabled ? 'border-gray-300 opacity-50 cursor-not-allowed' : 'border-emerald-300 hover:border-emerald-400 cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
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
            id="photo-upload-input"
            disabled={disabled}
          />
          
          <Button
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            onClick={() => document.getElementById('photo-upload-input')?.click()}
            disabled={disabled}
          >
            Выбрать фото
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoUploadCard;
