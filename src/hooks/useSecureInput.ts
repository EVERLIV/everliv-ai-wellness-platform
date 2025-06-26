
import { useState, useCallback } from 'react';
import { InputSanitizer } from '@/utils/inputSanitizer';

interface UseSecureInputOptions {
  maxLength?: number;
  sanitizeOnChange?: boolean;
  validateEmail?: boolean;
}

export const useSecureInput = (initialValue: string = '', options: UseSecureInputOptions = {}) => {
  const { maxLength = 1000, sanitizeOnChange = true, validateEmail = false } = options;
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((newValue: string) => {
    setError(null);
    
    let sanitizedValue = newValue;
    
    if (sanitizeOnChange) {
      sanitizedValue = InputSanitizer.sanitizeString(newValue);
    }
    
    if (sanitizedValue.length > maxLength) {
      setError(`Input exceeds maximum length of ${maxLength} characters`);
      return;
    }
    
    if (validateEmail && sanitizedValue && !InputSanitizer.isValidEmail(sanitizedValue)) {
      setError('Please enter a valid email address');
    }
    
    setValue(sanitizedValue);
  }, [maxLength, sanitizeOnChange, validateEmail]);

  const getSanitizedValue = useCallback(() => {
    return InputSanitizer.sanitizeString(value);
  }, [value]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const validate = useCallback(() => {
    if (validateEmail && value && !InputSanitizer.isValidEmail(value)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  }, [value, validateEmail]);

  return {
    value,
    error,
    handleChange,
    getSanitizedValue,
    reset,
    validate,
    isValid: !error
  };
};
