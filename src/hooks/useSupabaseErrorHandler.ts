
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useSupabaseErrorHandler = () => {
  const handleError = (error: PostgrestError | Error | null, context?: string) => {
    if (!error) return;
    
    console.error(`Supabase error ${context ? `in ${context}` : ''}:`, error);
    
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
    
    // Generic error handling
    const message = 'message' in error ? error.message : 'Произошла неизвестная ошибка';
    toast.error(`Ошибка: ${message}`);
  };

  return { handleError };
};
