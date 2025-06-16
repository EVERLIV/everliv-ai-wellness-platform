
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { isDevelopmentMode, createDevUser, createDevSession } from '@/utils/devMode';
import { secureLogger } from '@/utils/secureLogger';
import { AuthContextType } from '@/types/auth';

const DevAuthContext = createContext<AuthContextType | undefined>(undefined);

export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    secureLogger.debug('DevAuthProvider mounted');
    
    // Только в настоящем development режиме (localhost) автоматически авторизуем
    if (isDevelopmentMode()) {
      try {
        const devUser = createDevUser() as User;
        const devSession = createDevSession() as Session;
        
        secureLogger.debug('Setting dev user and session', {
          user_id: devUser.id
        });
        
        setUser(devUser);
        setSession(devSession);
        setIsLoading(false);
        
        secureLogger.info('Development mode: Auto-authorized as test user');
      } catch (error) {
        secureLogger.error('Failed to create dev user/session', {
          error: (error as Error).message
        });
        setIsLoading(false);
      }
    } else {
      secureLogger.debug('Not in development mode, no auto-auth');
      setIsLoading(false);
    }
  }, []);

  // Заглушки для dev режима с проверками безопасности
  const signInWithMagicLink = async (email: string) => {
    if (!isDevelopmentMode()) {
      throw new Error('Dev auth only available in development mode');
    }
    secureLogger.debug('Dev mode: Magic link simulated');
    return Promise.resolve();
  };

  const signUpWithMagicLink = async (email: string, userData: { nickname: string }) => {
    if (!isDevelopmentMode()) {
      throw new Error('Dev auth only available in development mode');
    }
    secureLogger.debug('Dev mode: Signup simulated');
    return Promise.resolve();
  };

  const signOut = async () => {
    if (!isDevelopmentMode()) {
      throw new Error('Dev auth only available in development mode');
    }
    setUser(null);
    setSession(null);
    secureLogger.debug('Dev mode: Signed out');
    return Promise.resolve();
  };

  const resetPassword = async (email: string) => {
    secureLogger.debug('Dev mode: Password reset simulated');
    return Promise.resolve();
  };

  const signIn = async (email: string, password: string) => {
    secureLogger.debug('Dev mode: Sign in simulated');
    return Promise.resolve();
  };

  const updatePassword = async (password: string) => {
    secureLogger.debug('Dev mode: Password update simulated');
    return Promise.resolve();
  };

  secureLogger.debug('DevAuthProvider rendering', {
    user_id: user?.id,
    hasSession: !!session,
    isLoading
  });

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
