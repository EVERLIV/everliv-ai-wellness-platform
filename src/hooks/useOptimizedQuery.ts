
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseErrorHandler } from './useSupabaseErrorHandler';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryFn'> {
  queryFn: () => Promise<T>;
  requireAuth?: boolean;
}

export const useOptimizedQuery = <T>({
  queryKey,
  queryFn,
  requireAuth = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  gcTime = 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry = false,
  ...options
}: OptimizedQueryOptions<T>) => {
  const { user } = useAuth();
  const { handleError } = useSupabaseErrorHandler();

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (requireAuth && !user) {
        throw new Error('Authentication required');
      }
      
      try {
        return await queryFn();
      } catch (error) {
        handleError(error as Error, `query ${queryKey?.join('.')}`);
        throw error;
      }
    },
    enabled: requireAuth ? !!user : true,
    staleTime,
    gcTime,
    retry,
    ...options
  });
};
