
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Camera } from "lucide-react";
import TextInputSection from "./TextInputSection";
import PhotoUploadSection from "./PhotoUploadSection";

interface InputMethodTabsProps {
  inputMethod: "text" | "photo";
  onInputMethodChange: (method: "text" | "photo") => void;
  text: string;
  onTextChange: (text: string) => void;
  selectedPhoto: File | null;
  photoPreview: string;
  canUsePhotoAnalysis: boolean;
  isAnalyzing: boolean;
  onPhotoSelect: (file: File) => void;
  onRemovePhoto: () => void;
}

const InputMethodTabs: React.FC<InputMethodTabsProps> = ({
  inputMethod,
  onInputMethodChange,
  text,
  onTextChange,
  selectedPhoto,
  photoPreview,
  canUsePhotoAnalysis,
  isAnalyzing,
  onPhotoSelect,
  onRemovePhoto,
}) => {
  return (
    <Tabs value={inputMethod} onValueChange={(value) => onInputMethodChange(value as "text" | "photo")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="text" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Ввод текста
        </TabsTrigger>
        <TabsTrigger value="photo" className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Фото анализа
          {!canUsePhotoAnalysis && (
            <span className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2 py-0.5 rounded-full ml-1">
              Pro
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="text" className="mt-4">
        <TextInputSection
          value={text}
          onChange={onTextChange}
          isAnalyzing={isAnalyzing}
        />
      </TabsContent>

      <TabsContent value="photo" className="mt-4">
        <PhotoUploadSection
          selectedPhoto={selectedPhoto}
          photoPreview={photoPreview}
          canUsePhotoAnalysis={canUsePhotoAnalysis}
          isAnalyzing={isAnalyzing}
          onPhotoSelect={onPhotoSelect}
          onRemovePhoto={onRemovePhoto}
        />
      </TabsContent>
    </Tabs>
  );
};

export default InputMethodTabs;
