
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
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};
