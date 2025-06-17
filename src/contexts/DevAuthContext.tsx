
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '@/types/auth';
import { isLovableDevelopment, createDevAdminUser, createDevAdminSession } from '@/utils/environmentDetection';
import { toast } from 'sonner';

const DevAuthContext = createContext<AuthContextType | undefined>(undefined);

export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLovableDevelopment()) {
      const devUser = createDevAdminUser();
      const devSession = createDevAdminSession();
      setUser(devUser);
      setSession(devSession);
      console.log('🔧 Dev mode: Auto-authenticated as dev admin');
    }
  }, []);

  const signInWithMagicLink = async (email: string) => {
    setIsLoading(true);
    try {
      toast.success('Dev mode: Magic link sent!');
      const devUser = createDevAdminUser();
      const devSession = createDevAdminSession();
      setUser(devUser);
      setSession(devSession);
    } catch (error) {
      toast.error('Dev mode: Sign in failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithMagicLink = async (email: string, userData: { nickname: string }) => {
    setIsLoading(true);
    try {
      toast.success('Dev mode: Account created!');
      const devUser = createDevAdminUser();
      const devSession = createDevAdminSession();
      setUser(devUser);
      setSession(devSession);
    } catch (error) {
      toast.error('Dev mode: Sign up failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    toast.info('Dev mode: Signed out');
  };

  const resetPassword = async (email: string) => {
    toast.info('Dev mode: Password reset email sent');
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const devUser = createDevAdminUser();
      const devSession = createDevAdminSession();
      setUser(devUser);
      setSession(devSession);
      toast.success('Dev mode: Signed in');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    toast.info('Dev mode: Password updated');
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
