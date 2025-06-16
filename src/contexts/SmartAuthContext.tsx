
import React from 'react';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthProvider } from '@/contexts/AuthContext';
import { DevAuthProvider } from '@/contexts/DevAuthContext';

interface SmartAuthProviderProps {
  children: React.ReactNode;
}

export const SmartAuthProvider = ({ children }: SmartAuthProviderProps) => {
  if (isDevelopmentMode()) {
    return <DevAuthProvider>{children}</DevAuthProvider>;
  }
  
  return <AuthProvider>{children}</AuthProvider>;
};
