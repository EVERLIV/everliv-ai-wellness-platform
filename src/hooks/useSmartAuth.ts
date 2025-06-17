
import { useContext } from 'react';
import { isLovableDevelopment } from '@/utils/environmentDetection';
import { useAuth as useProductionAuth } from '@/contexts/AuthContext';
import { useDevAuth } from '@/contexts/DevAuthContext';

export const useSmartAuth = () => {
  const isLovableDev = isLovableDevelopment();
  
  try {
    if (isLovableDev) {
      // В dev режиме пытаемся использовать DevAuth
      return useDevAuth();
    } else {
      // В production режиме используем обычный AuthContext
      return useProductionAuth();
    }
  } catch (error) {
    console.log('🔧 Auth context not ready yet:', error);
    // Возвращаем безопасные значения по умолчанию
    return {
      user: null,
      session: null,
      isLoading: true,
      signInWithMagicLink: async () => {},
      signUpWithMagicLink: async () => {},
      signOut: async () => {},
      resetPassword: async () => {},
      signIn: async () => {},
      updatePassword: async () => {},
    };
  }
};
