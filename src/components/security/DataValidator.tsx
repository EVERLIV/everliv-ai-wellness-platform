
import React from 'react';
import { InputSanitizer } from '@/utils/inputSanitizer';

interface DataValidatorProps {
  children: React.ReactNode;
  data?: any;
  requiredFields?: string[];
  onValidationError?: (error: string) => void;
}

export const DataValidator = ({ 
  children, 
  data, 
  requiredFields = [], 
  onValidationError 
}: DataValidatorProps) => {
  const validateData = () => {
    if (!data) return true;

    // Check required fields
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        onValidationError?.(`Required field missing: ${field}`);
        return false;
      }
    }

    // Validate UUID fields
    const uuidFields = ['user_id', 'id', 'chat_id', 'analysis_id', 'protocol_id'];
    for (const field of uuidFields) {
      if (data[field] && !InputSanitizer.isValidUUID(data[field])) {
        onValidationError?.(`Invalid UUID format: ${field}`);
        return false;
      }
    }

    // Validate email fields
    const emailFields = ['email', 'user_email'];
    for (const field of emailFields) {
      if (data[field] && !InputSanitizer.sanitizeEmail(data[field])) {
        onValidationError?.(`Invalid email format: ${field}`);
        return false;
      }
    }

    return true;
  };

  if (!validateData()) {
    return (
      <div className="text-red-600 p-4 rounded bg-red-50">
        Data validation failed. Please check your input.
      </div>
    );
  }

  return <>{children}</>;
};

export default DataValidator;
