
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { DevAuthContext } from '@/contexts/DevAuthContext';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthContextType } from '@/types/auth';

export const useSmartAuth = (): AuthContextType => {
  const isDevMode = isDevelopmentMode();
  
  // Пытаемся получить контексты
  const authContext = useContext(AuthContext);
  const devAuthContext = useContext(DevAuthContext);
  
  // В dev режиме приоритет DevAuthContext, если доступен
  if (isDevMode && devAuthContext) {
    return devAuthContext;
  }
  
  // В prod режиме или если DevAuthContext недоступен, используем AuthContext
  if (authContext) {
    return authContext;
  }
  
  // Fallback: создаем безопасный контекст с заглушками
  console.warn('⚠️ SmartAuth: No auth context available, using fallback');
  
  return {
    user: null,
    session: null,
    isLoading: false,
    signInWithMagicLink: async () => {
      throw new Error('Authentication not available');
    },
    signUpWithMagicLink: async () => {
      throw new Error('Authentication not available');
    },
    signOut: async () => {
      throw new Error('Authentication not available');
    },
    resetPassword: async () => {
      throw new Error('Authentication not available');
    },
    signIn: async () => {
      throw new Error('Authentication not available');
    },
    updatePassword: async () => {
      throw new Error('Authentication not available');
    },
  };
};
