
import { useState, useCallback } from 'react';
import { InputSanitizer } from '@/utils/inputSanitizer';

interface UseSecureInputOptions {
  maxLength?: number;
  allowHtml?: boolean;
  isMedicalData?: boolean;
}

export const useSecureInput = (options: UseSecureInputOptions = {}) => {
  const { maxLength = 1000, allowHtml = false, isMedicalData = false } = options;
  
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const sanitizeAndValidate = useCallback((input: string) => {
    let sanitized: string;
    
    if (isMedicalData) {
      sanitized = InputSanitizer.sanitizeMedicalData(input);
    } else {
      sanitized = InputSanitizer.sanitizeText(input, maxLength);
    }
    
    // Validation
    if (input !== sanitized) {
      setErrorMessage('Input contains potentially unsafe content');
      setIsValid(false);
    } else if (input.length > maxLength) {
      setErrorMessage(`Input exceeds maximum length of ${maxLength} characters`);
      setIsValid(false);
    } else {
      setErrorMessage('');
      setIsValid(true);
    }
    
    return sanitized;
  }, [maxLength, isMedicalData]);

  const handleInputChange = useCallback((input: string) => {
    const sanitized = sanitizeAndValidate(input);
    setValue(sanitized);
  }, [sanitizeAndValidate]);

  const reset = useCallback(() => {
    setValue('');
    setIsValid(true);
    setErrorMessage('');
  }, []);

  return {
    value,
    isValid,
    errorMessage,
    handleInputChange,
    reset,
    sanitizeAndValidate
  };
};
