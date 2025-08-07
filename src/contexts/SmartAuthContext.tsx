
import React from 'react';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthProvider } from '@/contexts/AuthContext';
import { DevAuthProvider } from '@/contexts/DevAuthContext';

interface SmartAuthProviderProps {
  children: React.ReactNode;
}

export const SmartAuthProvider = ({ children }: SmartAuthProviderProps) => {
  const isDevMode = isDevelopmentMode();
  
  console.log('🔧 SmartAuthProvider: Mode detection', { isDevMode });
  
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
