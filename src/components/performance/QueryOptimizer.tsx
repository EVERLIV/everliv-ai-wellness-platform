
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3 * 60 * 1000, // 3 minutes - более агрессивное кэширование
        gcTime: 15 * 60 * 1000, // 15 minutes - дольше держим в памяти
        retry: (failureCount, error) => {
          // Don't retry auth errors or permission errors
          if (error?.message?.includes('JWT') || 
              error?.message?.includes('auth') ||
              error?.message?.includes('row-level security')) {
            return false;
          }
          return failureCount < 1; // Меньше ретраев для скорости
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
        // Включаем background refetch для fresh data
        refetchIntervalInBackground: false,
      },
      mutations: {
        retry: false,
      },
    },
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
