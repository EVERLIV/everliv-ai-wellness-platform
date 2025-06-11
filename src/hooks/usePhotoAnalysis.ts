
import { useState } from "react";
import { toast } from "sonner";

export const usePhotoAnalysis = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>("");

  const handlePhotoSelect = (file: File) => {
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

    setSelectedPhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoPreviewUrl(url);
    
    toast.success("Фото успешно загружено");
  };

  const clearPhoto = () => {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setSelectedPhoto(null);
    setPhotoPreviewUrl("");
  };

  const convertToBase64 = async (): Promise<string | null> => {
    if (!selectedPhoto) return null;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(selectedPhoto);
    });
  };

  return {
    selectedPhoto,
    photoPreviewUrl,
    handlePhotoSelect,
    clearPhoto,
    convertToBase64
  };
};
