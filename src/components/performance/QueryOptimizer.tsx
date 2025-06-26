
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
          // Don't retry auth errors or permission errors
          if (error?.message?.includes('JWT') || 
              error?.message?.includes('auth') ||
              error?.message?.includes('row-level security')) {
            return false;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
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
    // Cleanup stale data every 15 minutes
    const interval = setInterval(() => {
      queryClient.getQueryCache().clear();
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryOptimizer;
