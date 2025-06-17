
import React from 'react';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthProvider } from '@/contexts/AuthContext';

interface SmartAuthProviderProps {
  children: React.ReactNode;
}

export const SmartAuthProvider = ({ children }: SmartAuthProviderProps) => {
  const isDevMode = isDevelopmentMode();
  console.log('🔧 SmartAuthProvider: Always using production auth for security');
  
  // Always use production authentication for security
  console.log('🔧 Using secure AuthProvider');
  return <AuthProvider>{children}</AuthProvider>;
};
