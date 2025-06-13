
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { nickname: string }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Auth provider mounted, checking session...');
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle auth events
        if (event === 'SIGNED_IN') {
          setIsLoading(false);
          // Defer additional data fetching
          setTimeout(() => {
            if (!mounted) return;
            toast.success('Успешный вход в систему');
            
            // Only navigate if on auth pages or home page, but NOT on admin pages
            const isOnAuthPages = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';
            const isOnAdminPages = location.pathname.startsWith('/admin');
            
            if (isOnAuthPages && !isOnAdminPages) {
              // Check if this is first login ever for this user
              const isFirstLogin = !session?.user?.last_sign_in_at;
              if (isFirstLogin) {
                navigate('/welcome');
              } else {
                navigate('/dashboard');
              }
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setIsLoading(false);
          setTimeout(() => {
            if (!mounted) return;
            toast.info('Вы вышли из системы');
            navigate('/');
          }, 0);
        } else if (event === 'PASSWORD_RECOVERY') {
          setIsLoading(false);
          setTimeout(() => {
            if (!mounted) return;
            toast.info('Перенаправляем на страницу сброса пароля');
            navigate('/reset-password');
          }, 0);
        } else if (event === 'INITIAL_SESSION') {
          // Don't redirect if we already have a session and user is browsing admin pages
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session ? 'Session found' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      setIsInitialized(true);
      
      // Only navigate on initial load if coming from auth pages and NOT on admin pages
      const isOnAuthPages = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';
      const isOnAdminPages = location.pathname.startsWith('/admin');
      
      if (session && !isInitialized && isOnAuthPages && !isOnAdminPages) {
        navigate('/dashboard');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, isInitialized]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // Auth state change will handle the navigation
      console.log('Login successful, navigation will be handled by auth state change');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Ошибка входа');
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: { nickname: string }) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });
      
      if (error) throw error;
      
      toast.success('Регистрация успешна! На вашу почту отправлено письмо для подтверждения.');
      // Navigate to welcome page even before email confirmation for better UX
      navigate('/welcome');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Ошибка регистрации');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Ошибка выхода из системы');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Инструкции по сбросу пароля отправлены на ваш email');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Ошибка отправки запроса на сброс пароля');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      toast.success('Пароль успешно обновлен');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Update password error:', error);
      toast.error(error.message || 'Ошибка обновления пароля');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signIn, 
      signUp, 
      signOut, 
      resetPassword, 
      updatePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
