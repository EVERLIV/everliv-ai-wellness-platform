
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
    
    // Clear any invalid tokens before starting
    const clearInvalidTokens = () => {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('sb-') && key.includes('auth-token')) {
            const token = localStorage.getItem(key);
            if (token && (token.includes('w435bqce2tys') || token.length < 10)) {
              console.log('Clearing invalid token during auth state:', key);
              localStorage.removeItem(key);
            }
          }
        });
      } catch (error) {
        console.error('Error clearing invalid tokens:', error);
      }
    };

    clearInvalidTokens();
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session present' : 'No session');
        
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
          setAuthState(prev => ({ ...prev, isLoading: false }));
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        // Clear potentially corrupted session data
        clearInvalidTokens();
      }
      
      console.log('Initial session check:', session ? 'Session found' : 'No session');
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isLoading: false,
        isInitialized: true,
      }));
      
      handleInitialSessionNavigation(session, authState.isInitialized);
    }).catch(error => {
      console.error('Failed to get session:', error);
      setAuthState(prev => ({
        ...prev,
        session: null,
        user: null,
        isLoading: false,
        isInitialized: true,
      }));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};
