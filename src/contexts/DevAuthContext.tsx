
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { isDevelopmentMode } from '@/utils/devMode';
import { AuthContextType } from '@/types/auth';

export const DevAuthContext = createContext<AuthContextType | undefined>(undefined);

export const DevAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 DevAuthProvider mounted');
    
    if (isDevelopmentMode()) {
      console.log('🔧 Development mode: Enhanced dev features available');
    }
    
    setIsLoading(false);
  }, []);

  // Функция для быстрого входа как администратор (только для dev)
  const devAdminLogin = async () => {
    if (!isDevelopmentMode()) {
      throw new Error('Dev admin login only available in development mode');
    }
    
    // Создаем фиктивного администратора для разработки
    const mockAdminUser: User = {
      id: 'dev-admin-12345',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'admin@dev.local',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'dev',
        providers: ['dev']
      },
      user_metadata: {
        full_name: 'Dev Admin',
        nickname: 'DevAdmin',
        role: 'admin'
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const mockSession: Session = {
      access_token: 'dev-access-token',
      refresh_token: 'dev-refresh-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockAdminUser
    };

    setUser(mockAdminUser);
    setSession(mockSession);
    
    console.log('🔧 Dev admin logged in:', mockAdminUser);
  };

  const signInWithMagicLink = async (email: string) => {
    if (isDevelopmentMode()) {
      console.log('🔧 Dev mode: Magic link login for', email);
      await devAdminLogin();
      return;
    }
    throw new Error('Use production authentication context');
  };

  const signUpWithMagicLink = async (email: string, userData: { nickname: string }) => {
    if (isDevelopmentMode()) {
      console.log('🔧 Dev mode: Signup for', email, userData);
      await devAdminLogin();
      return;
    }
    throw new Error('Use production authentication context');
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    console.log('🔧 Dev mode: Signed out');
  };

  const resetPassword = async (email: string) => {
    return signInWithMagicLink(email);
  };

  const signIn = async (email: string, password: string) => {
    return signInWithMagicLink(email);
  };

  const updatePassword = async (password: string) => {
    throw new Error('Password update not available in dev mode');
  };

  console.log('🔧 DevAuthProvider rendering:', { user: !!user, session: !!session, isLoading });

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
