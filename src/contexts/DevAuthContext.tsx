
import React, { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { createDevUser, createDevSession } from '@/utils/devMode';

const DevAuthContext = createContext<AuthContextType | undefined>(undefined);

export const DevAuthProvider = ({ children }: { children: ReactNode }) => {
  // В dev режиме всегда возвращаем мок-пользователя
  const devUser = createDevUser() as User;
  const devSession = createDevSession() as Session;

  const authContextValue: AuthContextType = {
    user: devUser,
    session: devSession,
    isLoading: false,
    signInWithMagicLink: async (email: string) => {
      console.log('🔧 Dev mode: Magic link signin simulated for', email);
    },
    signUpWithMagicLink: async (email: string, userData: { nickname: string }) => {
      console.log('🔧 Dev mode: Signup simulated for', email, userData);
    },
    signOut: async () => {
      console.log('🔧 Dev mode: Signout simulated');
    },
    resetPassword: async (email: string) => {
      console.log('🔧 Dev mode: Password reset simulated for', email);
    },
    signIn: async (email: string, password: string) => {
      console.log('🔧 Dev mode: Signin simulated for', email);
    },
    updatePassword: async (password: string) => {
      console.log('🔧 Dev mode: Password update simulated');
    },
  };

  return (
    <DevAuthContext.Provider value={authContextValue}>
      {children}
    </DevAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(DevAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a DevAuthProvider');
  }
  return context;
};
