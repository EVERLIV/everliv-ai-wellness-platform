
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { isDevelopmentMode, createDevUser, createDevSession } from '@/utils/devMode';
import { AuthContextType } from '@/types/auth';

const DevAuthContext = createContext<AuthContextType | undefined>(undefined);

export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isDevelopmentMode()) {
      // В dev режиме автоматически авторизуем пользователя
      const devUser = createDevUser() as User;
      const devSession = createDevSession() as Session;
      
      setUser(devUser);
      setSession(devSession);
      setIsLoading(false);
      
      console.log('🔧 Development mode: Auto-authorized as test user');
    } else {
      setIsLoading(false);
    }
  }, []);

  // Заглушки для dev режима
  const signInWithMagicLink = async (email: string) => {
    if (isDevelopmentMode()) {
      console.log('🔧 Dev mode: Magic link simulated for', email);
      return Promise.resolve();
    }
    throw new Error('Not implemented in dev auth context');
  };

  const signUpWithMagicLink = async (email: string, userData: { nickname: string }) => {
    if (isDevelopmentMode()) {
      console.log('🔧 Dev mode: Signup simulated for', email);
      return Promise.resolve();
    }
    throw new Error('Not implemented in dev auth context');
  };

  const signOut = async () => {
    if (isDevelopmentMode()) {
      setUser(null);
      setSession(null);
      console.log('🔧 Dev mode: Signed out');
      return Promise.resolve();
    }
    throw new Error('Not implemented in dev auth context');
  };

  const resetPassword = async (email: string) => {
    console.log('🔧 Dev mode: Password reset simulated for', email);
    return Promise.resolve();
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔧 Dev mode: Sign in simulated for', email);
    return Promise.resolve();
  };

  const updatePassword = async (password: string) => {
    console.log('🔧 Dev mode: Password update simulated');
    return Promise.resolve();
  };

  return (
    <DevAuthContext.Provider value={{
      user,
      session,
      isLoading,
      signInWithMagicLink,
      signUpWithMagicLink,
      signOut,
      resetPassword,
      signIn,
      updatePassword,
    }}>
      {children}
    </DevAuthContext.Provider>
  );
};

export const useDevAuth = () => {
  const context = useContext(DevAuthContext);
  if (context === undefined) {
    throw new Error('useDevAuth must be used within a DevAuthProvider');
  }
  return context;
};
