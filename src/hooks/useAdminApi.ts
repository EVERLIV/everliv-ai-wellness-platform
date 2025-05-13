
import { useState, useCallback } from 'react';
import { fetchWithCacheBusting } from '../utils/cacheBusting';

/**
 * A hook for making API calls in admin components with built-in cache busting
 */
export function useAdminApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async <T>(
    url: string, 
    options?: RequestInit
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithCacheBusting(url, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchData,
    loading,
    error,
  };
}
