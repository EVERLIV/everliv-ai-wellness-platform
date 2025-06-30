
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { withConnectionCheck } from '@/utils/retryUtils';
import { useSupabaseErrorHandler } from './useSupabaseErrorHandler';

interface ApiCallOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  requireAuth?: boolean;
}

export const useSecureApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  const { handleError } = useSupabaseErrorHandler();

  const makeApiCall = async <T = any>(options: ApiCallOptions): Promise<T | null> => {
    const { endpoint, method = 'GET', body, requireAuth = true } = options;

    if (requireAuth && !session?.access_token) {
      setError('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await withConnectionCheck(async () => {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const response = await fetch(endpoint, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      handleError(err as Error, 'API call');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const callEdgeFunction = async <T = any>(
    functionName: string, 
    payload?: any
  ): Promise<T | null> => {
    if (!session?.access_token) {
      setError('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await withConnectionCheck(async () => {
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: payload,
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          throw error;
        }

        return data;
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Function call failed';
      setError(errorMessage);
      handleError(err as Error, `Edge function: ${functionName}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    makeApiCall,
    callEdgeFunction,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
