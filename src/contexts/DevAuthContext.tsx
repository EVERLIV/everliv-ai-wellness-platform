
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthContextType } from '@/types/auth';

const DevAuthContext = createContext<AuthContextType | undefined>(undefined);

export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 DevAuthProvider mounted - SECURITY: No auto-auth in dev mode');
    
    // Remove automatic authentication bypass for security
    if (isDevelopmentMode()) {
      console.log('🔧 Development mode: Authentication required');
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Remove all authentication bypasses
  const signInWithMagicLink = async (email: string) => {
    throw new Error('Use production authentication context');
  };

  const signUpWithMagicLink = async (email: string, userData: { nickname: string }) => {
    throw new Error('Use production authentication context');
  };

  const signOut = async () => {
    throw new Error('Use production authentication context');
  };

  const resetPassword = async (email: string) => {
    throw new Error('Use production authentication context');
  };

  const signIn = async (email: string, password: string) => {
    throw new Error('Use production authentication context');
  };

  const updatePassword = async (password: string) => {
    throw new Error('Use production authentication context');
  };

  console.log('🔧 DevAuthProvider rendering with security enabled:', { user: !!user, session: !!session, isLoading });

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
