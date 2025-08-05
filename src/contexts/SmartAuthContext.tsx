
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
  
  if (isDevMode) {
    console.log('🔧 Using DevAuthProvider with enhanced dev features');
    return (
      <DevAuthProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </DevAuthProvider>
    );
  }
  
  console.log('🔧 Using production AuthProvider');
  return <AuthProvider>{children}</AuthProvider>;
};
