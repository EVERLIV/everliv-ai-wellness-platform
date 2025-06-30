
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { isRetryableError } from '@/utils/retryUtils';

export const useSupabaseErrorHandler = () => {
  const handleError = (error: PostgrestError | Error | null, context?: string) => {
    if (!error) return;
    
    console.error(`Supabase error ${context ? `in ${context}` : ''}:`, error);
    
    // Обработка сетевых ошибок
    if (isRetryableError(error)) {
      toast.error('Проблемы с подключением. Попробуйте еще раз через несколько секунд.');
      return;
    }
    
    // Handle common RLS policy violations
    if ('code' in error && error.code === 'PGRST301') {
      toast.error('Доступ запрещен. Пожалуйста, войдите в систему.');
      return;
    }
    
    // Handle foreign key violations
    if ('code' in error && error.code === '23503') {
      toast.error('Ошибка связи данных. Попробуйте еще раз.');
      return;
    }
    
    // Handle unique constraint violations
    if ('code' in error && error.code === '23505') {
      toast.error('Такая запись уже существует.');
      return;
    }
    
    // Handle connection errors
    if ('code' in error && (
      error.code === 'ERR_CONNECTION_RESET' ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ERR_INTERNET_DISCONNECTED'
    )) {
      toast.error('Проблемы с сетевым подключением. Проверьте соединение с интернетом.');
      return;
    }
    
    // Generic error handling
    const message = 'message' in error ? error.message : 'Произошла неизвестная ошибка';
    
    // Специальная обработка для часто встречающихся ошибок
    if (message.toLowerCase().includes('failed to fetch')) {
      toast.error('Не удается подключиться к серверу. Проверьте подключение к интернету.');
      return;
    }
    
    if (message.toLowerCase().includes('timeout')) {
      toast.error('Превышено время ожидания. Попробуйте еще раз.');
      return;
    }
    
    toast.error(`Ошибка: ${message}`);
  };

  const handleRetryableOperation = async <T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  };

  return { handleError, handleRetryableOperation };
};
