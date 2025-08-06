
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthNavigation } from './useAuthNavigation';
import { AuthState } from '@/types/auth';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isInitialized: false,
  });

  const {
    handleSignInNavigation,
    handleSignOutNavigation,
    handlePasswordRecoveryNavigation,
    handleInitialSessionNavigation,
  } = useAuthNavigation();

  useEffect(() => {
    let mounted = true;
    
    // Принудительный таймаут для предотвращения зависания
    const forceTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('🔧 Auth initialization timeout, forcing completion');
        setAuthState(prev => {
          // Если уже есть сессия, не сбрасываем её
          if (prev.session) {
            return {
              ...prev,
              isLoading: false,
              isInitialized: true,
            };
          }
          // Если нет сессии, помечаем как завершённое без пользователя
          return {
            ...prev,
            isLoading: false,
            isInitialized: true,
            user: null,
            session: null,
          };
        });
      }
    }, 8000); // 8 секунд таймаут
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isLoading: false,
        }));
        
        // Handle auth events
        if (event === 'SIGNED_IN') {
          handleSignInNavigation(session);
        } else if (event === 'SIGNED_OUT') {
          handleSignOutNavigation();
        } else if (event === 'PASSWORD_RECOVERY') {
          handlePasswordRecoveryNavigation();
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isLoading: false,
        isInitialized: true,
      }));
      
      if (session && !error) {
        handleInitialSessionNavigation(session, false);
      }
    }).catch((error) => {
      console.error('Failed to get session:', error);
      if (mounted) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true,
        }));
      }
    });

    return () => {
      mounted = false;
      clearTimeout(forceTimeout);
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};
