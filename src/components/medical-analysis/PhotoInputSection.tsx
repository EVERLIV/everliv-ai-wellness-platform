
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle, Camera } from "lucide-react";
import { toast } from "sonner";

interface PhotoInputSectionProps {
  photoUrl: string;
  onPhotoUrlChange: (url: string) => void;
}

const PhotoInputSection: React.FC<PhotoInputSectionProps> = ({
  photoUrl,
  onPhotoUrlChange
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setPhotoUploading(true);
    setUploadError(null);
    setPhotoFile(file);

    // Создаем URL для предварительного просмотра
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onPhotoUrlChange(result);
      setPhotoUploading(false);
    };
    reader.onerror = () => {
      setUploadError("Ошибка при загрузке файла");
      setPhotoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (file: File) => {
    handleFileUpload(file);
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

    if (photoUploading) {
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

  const onPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="photo-upload" className="text-sm font-medium text-gray-700 mb-2 block">
          Загрузить фото анализа
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Загрузите четкое фото или скан ваших результатов для автоматического распознавания
        </p>
        
        {!photoUrl ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 bg-gray-50'
            } ${
              photoUploading 
                ? 'cursor-not-allowed opacity-50' 
                : 'cursor-pointer hover:border-gray-300 hover:bg-gray-100'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={!photoUploading ? handleUploadClick : undefined}
          >
            <Camera className={`h-12 w-12 mx-auto mb-4 ${
              isDragOver ? 'text-primary' : 'text-gray-400'
            }`} />
            
            {isDragOver ? (
              <p className="text-sm text-primary font-medium mb-4">
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
              disabled={photoUploading}
              className="flex items-center gap-2 pointer-events-none"
            >
              {photoUploading ? (
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
          </div>
        ) : null}
        
        <input
          ref={fileInputRef}
          id="medicalPhotoInput"
          type="file"
          accept="image/*"
          onChange={onPhotoUpload}
          className="hidden"
          disabled={photoUploading}
        />
        
        {uploadError && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
      </div>
      
      {photoUrl && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Предварительный просмотр:</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
            <img
              src={photoUrl}
              alt="Загруженные результаты анализа"
              className="max-w-full max-h-64 mx-auto rounded shadow-sm"
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              {photoFile?.name} ({((photoFile?.size || 0) / 1024).toFixed(1)} KB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoInputSection;
