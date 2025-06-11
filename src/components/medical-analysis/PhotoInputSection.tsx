
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";
import { ANALYSIS_TYPES } from "./AnalysisTypeSelector";

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
  const selectedAnalysisType = ANALYSIS_TYPES.find(type => type.value === analysisType);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="photo-upload" className="text-sm font-medium text-gray-700 mb-2 block">
          Загрузить фото {selectedAnalysisType?.label.toLowerCase()}
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Загрузите четкое фото или скан ваших результатов для автоматического распознавания
        </p>
        
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('medicalPhotoInput')?.click()}
            className="flex items-center gap-2"
            disabled={photoUploading}
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
          <input
            id="medicalPhotoInput"
            type="file"
            accept="image/*"
            onChange={onPhotoUpload}
            className="hidden"
          />
        </div>
        
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
