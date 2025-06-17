
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { isLovableDevelopment, createDevAdminUser, createDevAdminSession } from '@/utils/environmentDetection';
import { AuthContextType } from '@/types/auth';
import { toast } from 'sonner';

const DevAuthContext = createContext<AuthContextType | undefined>(undefined);

export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 DevAuthProvider: Initializing Lovable dev authentication');
    
    if (isLovableDevelopment()) {
      console.log('🔧 Lovable development environment detected - creating dev admin session');
      
      try {
        const devUser = createDevAdminUser() as unknown as User;
        const devSession = createDevAdminSession() as unknown as Session;
        
        setUser(devUser);
        setSession(devSession);
        
        toast.success('🔧 Dev Admin режим активирован в Lovable!', {
          description: 'Автоматический вход администратора для разработки'
        });
        
        console.log('🔧 Dev admin session created:', { 
          userId: devUser.id, 
          email: devUser.email 
        });
      } catch (error) {
        console.error('🔧 Error creating dev admin session:', error);
        toast.error('Ошибка создания dev-сессии');
      }
    } else {
      console.log('🔧 Production environment - dev auth disabled');
    }
    
    setIsLoading(false);
  }, []);

  // Dev environment implementations
  const signInWithMagicLink = async (email: string) => {
    if (isLovableDevelopment()) {
      console.log('🔧 Dev mode: Simulating magic link login for', email);
      toast.success('В dev-режиме уже выполнен автоматический вход администратора');
      return Promise.resolve();
    }
    throw new Error('Use production authentication context');
  };

  const signUpWithMagicLink = async (email: string, userData: { nickname: string }) => {
    if (isLovableDevelopment()) {
      console.log('🔧 Dev mode: Simulating signup for', email);
      toast.success('В dev-режиме уже создан администратор');
      return Promise.resolve();
    }
    throw new Error('Use production authentication context');
  };

  const signOut = async () => {
    if (isLovableDevelopment()) {
      console.log('🔧 Dev mode: Simulating logout');
      setUser(null);
      setSession(null);
      toast.success('Выход из dev-режима');
      return Promise.resolve();
    }
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

  console.log('🔧 DevAuthProvider state:', { 
    user: !!user, 
    session: !!session, 
    isLoading,
    isLovableDev: isLovableDevelopment()
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
