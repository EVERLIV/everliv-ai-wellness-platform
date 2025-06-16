
import React from 'react';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthProvider, useAuth as useRegularAuth } from '@/contexts/AuthContext';
import { DevAuthProvider, useAuth as useDevAuth } from '@/contexts/DevAuthContext';

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

// Export a unified useAuth hook that works in both environments
export const useAuth = () => {
  const isDevMode = isDevelopmentMode();
  
  if (isDevMode) {
    return useDevAuth();
  }
  
  return useRegularAuth();
};
