import { toast } from 'sonner';

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export const createError = (code: string, message: string, details?: any): AppError => ({
  code,
  message,
  details,
});

export const handleError = (error: any, context?: string) => {
  console.error(`Error in ${context || 'unknown context'}:`, error);
  
  // Handle different error types
  if (error?.message?.includes('Failed to fetch')) {
    toast.error('Проблемы с подключением к серверу. Проверьте интернет-соединение.');
    return;
  }
  
  if (error?.message?.includes('OpenAI')) {
    toast.error('Временные проблемы с ИИ-сервисом. Попробуйте позже.');
    return;
  }
  
  if (error?.code === 'PGRST301') {
    toast.error('Недостаточно прав доступа. Проверьте авторизацию.');
    return;
  }
  
  // Generic error
  const message = error?.message || 'Произошла неожиданная ошибка';
  toast.error(message);
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      return null;
    }
  };
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};