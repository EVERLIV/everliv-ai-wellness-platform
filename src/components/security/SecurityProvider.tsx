
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { SecurityHeaders } from '@/utils/securityHeaders';
import { toast } from 'sonner';
import NetworkStatusIndicator from '@/components/common/NetworkStatusIndicator';

interface SecurityContextType {
  checkRateLimit: (key: string, maxRequests: number, windowMs: number) => boolean;
  reportSecurityEvent: (event: string, details?: any) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  useEffect(() => {
    // Apply security headers if running in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Security headers would be applied in production:', SecurityHeaders.getCSPHeaders());
    }

    // Monitor for suspicious activity
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Clear sensitive data when tab becomes hidden
        sessionStorage.removeItem('temp_sensitive_data');
      }
    };

    // Security event monitoring
    const handleBeforeUnload = () => {
      // Clear sensitive session data
      sessionStorage.clear();
    };

    // Network error monitoring
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      // Логируем сетевые ошибки для мониторинга
      if (error && (
        error.code === 'ERR_CONNECTION_RESET' ||
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Failed to fetch')
      )) {
        console.warn('🌐 Network error detected:', {
          error: error.message || error,
          code: error.code,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const checkRateLimit = (key: string, maxRequests: number, windowMs: number): boolean => {
    return SecurityHeaders.checkClientRateLimit(key, maxRequests, windowMs);
  };

  const reportSecurityEvent = (event: string, details?: any) => {
    console.warn(`🔒 Security Event: ${event}`, details);
    
    // In production, you might want to send this to a security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to monitoring service
      // analyticsService.track('security_event', { event, details });
    }
  };

  return (
    <SecurityContext.Provider value={{ checkRateLimit, reportSecurityEvent }}>
      {children}
      <NetworkStatusIndicator />
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
