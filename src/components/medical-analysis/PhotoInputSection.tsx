
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle, Camera } from "lucide-react";
import { ANALYSIS_TYPES } from "./AnalysisTypeSelector";
import { toast } from "sonner";

interface PhotoInputSectionProps {
  photoFile: File | null;
  photoUrl: string;
  analysisType: string;
  photoUploading: boolean;
  uploadError: string | null;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoInputSection: React.FC<PhotoInputSectionProps> = ({
  photoFile,
  photoUrl,
  analysisType,
  photoUploading,
  uploadError,
  onPhotoUpload
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedAnalysisType = ANALYSIS_TYPES.find(type => type.value === analysisType);

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
    if (!validateFile(file)) {
      return;
    }

    // Устанавливаем файл в input и вызываем обработчик
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      
      // Создаем событие change
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', {
        writable: false,
        value: fileInputRef.current
      });
      
      onPhotoUpload(event as React.ChangeEvent<HTMLInputElement>);
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

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="photo-upload" className="text-sm font-medium text-gray-700 mb-2 block">
          Загрузить фото {selectedAnalysisType?.label.toLowerCase()}
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
