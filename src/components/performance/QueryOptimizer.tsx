
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';

const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes - more aggressive caching
        gcTime: 30 * 60 * 1000, // 30 minutes - keep in memory longer
        retry: (failureCount, error) => {
          // Don't retry auth errors or permission errors
          if (error?.message?.includes('JWT') || 
              error?.message?.includes('auth') ||
              error?.message?.includes('row-level security')) {
            return false;
          }
          return failureCount < 2; // Reduce retries for speed
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: 'always',
        refetchIntervalInBackground: false,
        // Network mode optimization
        networkMode: 'online',
        // Optimize background updates
        structuralSharing: true,
      },
      mutations: {
        retry: false,
        networkMode: 'online',
      },
    },
    // Add query deduplication
    queryCache: new QueryCache({
      onError: (error) => {
        console.error('Query cache error:', error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error('Mutation cache error:', error);
      },
    }),
  });
};

interface QueryOptimizerProps {
  children: ReactNode;
}

export const QueryOptimizer = ({ children }: QueryOptimizerProps) => {
  const [queryClient] = React.useState(() => createOptimizedQueryClient());

  React.useEffect(() => {
    // Более умная очистка кэша - только устаревшие данные
    const interval = setInterval(() => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      
      queries.forEach(query => {
        const lastFetched = query.state.dataUpdatedAt;
        const now = Date.now();
        const maxAge = 30 * 60 * 1000; // 30 минут
        
        if (now - lastFetched > maxAge) {
          cache.remove(query);
        }
      });
    }, 10 * 60 * 1000); // Проверяем каждые 10 минут

    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryOptimizer;
