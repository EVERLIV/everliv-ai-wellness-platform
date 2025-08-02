
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { DevAuthContext } from '@/contexts/DevAuthContext';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthContextType } from '@/types/auth';
import { useAuthFallback } from '@/hooks/useAuthFallback';
import { prodLogger } from '@/utils/production-logger';

export const useSmartAuth = (): AuthContextType => {
  const isDevMode = isDevelopmentMode();
  const fallbackAuth = useAuthFallback();
  
  // Получаем оба контекста
  const authContext = useContext(AuthContext);
  const devAuthContext = useContext(DevAuthContext);
  
  prodLogger.info('SmartAuth context check', { 
    isDevMode, 
    hasAuthContext: !!authContext, 
    hasDevAuthContext: !!devAuthContext,
    devUser: devAuthContext?.user?.email,
    authUser: authContext?.user?.email
  });
  
  try {
    // В dev режиме приоритет DevAuthContext
    if (isDevMode && devAuthContext) {
      prodLogger.info('Using DevAuthContext', {
        user: devAuthContext.user?.email,
        hasSession: !!devAuthContext.session
      });
      return devAuthContext;
    }
    
    // В prod режиме или если DevAuthContext недоступен, используем AuthContext
    if (authContext) {
      prodLogger.info('Using AuthContext', {
        user: authContext.user?.email,
        hasSession: !!authContext.session
      });
      return authContext;
    }
    
    // Безопасный fallback
    prodLogger.warn('SmartAuth: No auth context available, using fallback');
    return fallbackAuth;
    
  } catch (error) {
    prodLogger.error('SmartAuth error, using fallback', {}, error as Error);
    return fallbackAuth;
  }
};
