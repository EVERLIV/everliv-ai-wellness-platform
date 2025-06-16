
import React from 'react';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthProvider } from '@/contexts/AuthContext';
import { DevAuthProvider } from '@/contexts/DevAuthContext';

interface SmartAuthProviderProps {
  children: React.ReactNode;
}

export const SmartAuthProvider = ({ children }: SmartAuthProviderProps) => {
  const isDevMode = isDevelopmentMode();
  console.log('🔧 SmartAuthProvider: Dev mode detected?', isDevMode);
  
  if (isDevMode) {
    console.log('🔧 Using DevAuthProvider');
    return <DevAuthProvider>{children}</DevAuthProvider>;
  }
  
  console.log('🔧 Using regular AuthProvider');
  return <AuthProvider>{children}</AuthProvider>;
};
