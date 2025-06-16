
import { isDevelopmentMode, createDevUser } from '@/utils/devMode';
import { User } from '@supabase/supabase-js';

// Hook для получения dev пользователя или настоящего
export const useDevAuth = () => {
  const getDevUser = (): User | null => {
    if (isDevelopmentMode()) {
      console.log('🔧 Dev mode: Using dev user');
      return createDevUser() as User;
    }
    return null;
  };

  const getDevUserId = (): string | null => {
    if (isDevelopmentMode()) {
      return 'dev-user-123';
    }
    return null;
  };

  return {
    getDevUser,
    getDevUserId,
    isDev: isDevelopmentMode()
  };
};
