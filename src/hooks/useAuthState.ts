
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
    console.log('Auth provider mounted, checking session...');
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!mounted) return;
        
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));
        
        // Handle auth events
        if (event === 'SIGNED_IN') {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          handleSignInNavigation(session);
        } else if (event === 'SIGNED_OUT') {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          handleSignOutNavigation();
        } else if (event === 'PASSWORD_RECOVERY') {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          handlePasswordRecoveryNavigation();
        } else if (event === 'INITIAL_SESSION') {
          // Don't redirect if we already have a session and user is browsing admin pages
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session ? 'Session found' : 'No session');
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isLoading: false,
        isInitialized: true,
      }));
      
      handleInitialSessionNavigation(session, authState.isInitialized);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};
