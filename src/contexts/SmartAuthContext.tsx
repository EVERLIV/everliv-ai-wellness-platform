
import React, { useMemo } from 'react';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthProvider } from '@/contexts/AuthContext';
import { DevAuthProvider } from '@/contexts/DevAuthContext';

interface SmartAuthProviderProps {
  children: React.ReactNode;
}

export const SmartAuthProvider = ({ children }: SmartAuthProviderProps) => {
  // Мемоизируем результат проверки dev режима для избежания множественных вызовов
  const isDevMode = useMemo(() => {
    const result = isDevelopmentMode();
    console.log('🔧 SmartAuthProvider: Mode detection (memoized)', { isDevMode: result });
    return result;
  }, []);
  
  // В dev режиме используем только AuthProvider (без DevAuthProvider для упрощения)
  console.log('🔧 Using production AuthProvider (simplified)');
  return <AuthProvider>{children}</AuthProvider>;
};
