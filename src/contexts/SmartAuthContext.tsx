
import React from 'react';
import { isLovableDevelopment } from '@/utils/environmentDetection';
import { AuthProvider } from '@/contexts/AuthContext';
import { DevAuthProvider } from '@/contexts/DevAuthContext';

interface SmartAuthProviderProps {
  children: React.ReactNode;
}

export const SmartAuthProvider = ({ children }: SmartAuthProviderProps) => {
  const isLovableDev = isLovableDevelopment();
  
  console.log('🔧 SmartAuthProvider: Environment detection', {
    isLovableDev,
    hostname: window.location.hostname
  });
  
  if (isLovableDev) {
    console.log('🔧 Using DevAuthProvider for Lovable development');
    return <DevAuthProvider>{children}</DevAuthProvider>;
  }
  
  console.log('🔧 Using production AuthProvider');
  return <AuthProvider>{children}</AuthProvider>;
};
