import React, { createContext, useContext, useEffect } from 'react';
import { monitoring } from '@/utils/monitoring';
import { detectMemoryLeaks } from '@/utils/performance';

interface PerformanceContextType {
  recordMetric: (name: string, value: number) => void;
  reportError: (error: any) => void;
  getHealthStatus: () => string;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  useEffect(() => {
    // Set up periodic health checks
    const healthInterval = setInterval(() => {
      detectMemoryLeaks();
      
      // Check performance metrics
      const metrics = monitoring.getMetrics();
      const averageLoadTime = monitoring.getAverageMetric('page_load_time');
      
      if (averageLoadTime > 3000) {
        console.warn('High page load time detected:', averageLoadTime);
      }
    }, 60000); // Check every minute

    return () => clearInterval(healthInterval);
  }, []);

  const contextValue: PerformanceContextType = {
    recordMetric: monitoring.recordMetric.bind(monitoring),
    reportError: monitoring.reportError.bind(monitoring),
    getHealthStatus: monitoring.getHealthStatus.bind(monitoring),
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export default PerformanceProvider;