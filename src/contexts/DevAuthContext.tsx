
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '@/types/auth';
import { isLovableDevelopment } from '@/utils/environmentDetection';

const DevAuthContext = createContext<AuthContextType | undefined>(undefined);

export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLovableDevelopment()) {
      // Create a dev user for testing
      const devUser = {
        id: 'dev-admin-lovable-12345',
        email: 'dev-admin@lovable.dev',
        user_metadata: {
          first_name: 'Dev',
          last_name: 'Admin'
        },
        created_at: new Date().toISOString(),
      };

      const devSession = {
        access_token: 'dev-token',
        refresh_token: 'dev-refresh',
        user: devUser,
        expires_at: Date.now() + 86400000, // 24 hours
      };

      setUser(devUser);
      setSession(devSession);
      console.log('🔧 Dev user created:', devUser);
    }
    setIsLoading(false);
  }, []);

  const signInWithMagicLink = async (email: string) => {
    console.log('🔧 Dev signInWithMagicLink:', email);
    // Simulate magic link login in dev mode
  };

  const signUpWithMagicLink = async (email: string, userData: { nickname: string }) => {
    console.log('🔧 Dev signUpWithMagicLink:', email, userData);
    // Simulate magic link signup in dev mode
  };

  const signOut = async () => {
    console.log('🔧 Dev signOut');
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    console.log('🔧 Dev resetPassword:', email);
    // Simulate password reset in dev mode
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔧 Dev signIn:', email);
    // Simulate sign in in dev mode
  };

  const updatePassword = async (password: string) => {
    console.log('🔧 Dev updatePassword');
    // Simulate password update in dev mode
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
