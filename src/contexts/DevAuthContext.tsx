
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
      
      // Автоматически создаем dev пользователя с правильным UUID
      const autoCreateDevUser = () => {
        console.log('🔧 Auto-creating dev user...');
        
        // Используем фиксированный UUID для dev пользователя
        const devUserId = '00000000-0000-0000-0000-000000000001';
        
        const mockDevUser: User = {
          id: devUserId,
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
            first_name: 'Dev',
            last_name: 'Admin'
          },
          identities: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const mockSession: Session = {
          access_token: 'dev-access-token-' + Date.now(),
          refresh_token: 'dev-refresh-token-' + Date.now(),
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: mockDevUser
        };

        // Сохраняем сессию в localStorage для персистентности
        localStorage.setItem('dev-auth-session', JSON.stringify(mockSession));
        
        setUser(mockDevUser);
        setSession(mockSession);
        
        console.log('🔧 Dev user auto-created:', {
          user: mockDevUser.email,
          id: mockDevUser.id
        });
      };

      // Проверяем, есть ли сохраненная dev сессия
      const savedDevSession = localStorage.getItem('dev-auth-session');
      if (savedDevSession) {
        try {
          const parsedSession = JSON.parse(savedDevSession);
          // Проверяем, что у сохраненной сессии правильный UUID
          if (parsedSession.user && parsedSession.user.id === '00000000-0000-0000-0000-000000000001') {
            console.log('🔧 Restoring saved dev session:', parsedSession.user.email);
            setUser(parsedSession.user);
            setSession(parsedSession);
          } else {
            // Если сессия устарела, создаем новую
            console.log('🔧 Outdated dev session, creating new one');
            localStorage.removeItem('dev-auth-session');
            autoCreateDevUser();
          }
        } catch (error) {
          console.error('🔧 Error restoring dev session:', error);
          localStorage.removeItem('dev-auth-session');
          autoCreateDevUser();
        }
      } else {
        // Если нет сохраненной сессии, создаем новую
        autoCreateDevUser();
      }
    }
    
    setIsLoading(false);
  }, []);

  const signInWithMagicLink = async (email: string) => {
    if (isDevelopmentMode()) {
      console.log('🔧 Dev mode: Magic link login for', email);
      // В dev режиме сразу логиним пользователя
      return;
    }
    throw new Error('Use production authentication context');
  };

  const signUpWithMagicLink = async (email: string, userData: { nickname: string }) => {
    if (isDevelopmentMode()) {
      console.log('🔧 Dev mode: Signup for', email, userData);
      return;
    }
    throw new Error('Use production authentication context');
  };

  const signOut = async () => {
    console.log('🔧 Dev mode: Signing out...');
    localStorage.removeItem('dev-auth-session');
    setUser(null);
    setSession(null);
    console.log('🔧 Dev mode: Signed out successfully');
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

  console.log('🔧 DevAuthProvider state:', { 
    user: user?.email, 
    session: !!session, 
    isLoading,
    hasLocalStorage: !!localStorage.getItem('dev-auth-session')
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
