import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { prodLogger } from '@/utils/production-logger';

// Безопасный fallback для аутентификации
export const useAuthFallback = (): AuthContextType => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку для предотвращения мгновенного редиректа
    const timer = setTimeout(() => {
      setIsLoading(false);
      prodLogger.warn('Using auth fallback - no authentication context available');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const throwAuthError = async () => {
    prodLogger.error('Authentication method called but no auth provider available');
    throw new Error('Authentication not available - please check auth provider setup');
  };

  return {
    user: null,
    session: null,
    isLoading,
    signInWithMagicLink: throwAuthError,
    signUpWithMagicLink: throwAuthError,
    signOut: throwAuthError,
    resetPassword: throwAuthError,
    signIn: throwAuthError,
    updatePassword: throwAuthError,
  };
};