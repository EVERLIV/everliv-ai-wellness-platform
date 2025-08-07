
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

interface SmartAuthProviderProps {
  children: React.ReactNode;
}

export const SmartAuthProvider = ({ children }: SmartAuthProviderProps) => (
  <AuthProvider>{children}</AuthProvider>
);
