
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Upload } from 'lucide-react';
import { InputSanitizer } from '@/utils/inputSanitizer';

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  allowedTypes: string[];
  maxSize: number; // in bytes
  accept?: string;
  className?: string;
}

export const SecureFileUpload = ({
  onFileSelect,
  allowedTypes,
  maxSize,
  accept,
  className = ''
}: SecureFileUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelectFile = (file: File) => {
    setError(null);
    
    const validationError = InputSanitizer.validateFileUpload(file, allowedTypes, maxSize);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-gray-500">
          Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Allowed: {allowedTypes.map(type => type.split('/')[1]).join(', ')}
        </p>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecureFileUpload;
