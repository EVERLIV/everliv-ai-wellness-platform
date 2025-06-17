
import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurity } from './SecurityProvider';
import { toast } from 'sonner';

interface EnhancedSecureApiWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  rateLimit?: {
    key: string;
    maxRequests: number;
    windowMs: number;
  };
  onSecurityViolation?: () => void;
}

export const EnhancedSecureApiWrapper: React.FC<EnhancedSecureApiWrapperProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  rateLimit,
  onSecurityViolation
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const { checkRateLimit, reportSecurityEvent } = useSecurity();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      // Check authentication
      if (requireAuth && !user) {
        reportSecurityEvent('unauthorized_access_attempt', { requireAuth, requireAdmin });
        if (onSecurityViolation) onSecurityViolation();
        return;
      }

      // Check rate limiting
      if (rateLimit && user) {
        const limitKey = `${rateLimit.key}_${user.id}`;
        if (!checkRateLimit(limitKey, rateLimit.maxRequests, rateLimit.windowMs)) {
          reportSecurityEvent('rate_limit_exceeded', { key: rateLimit.key, userId: user.id });
          toast.error('Слишком много запросов. Попробуйте позже.');
          if (onSecurityViolation) onSecurityViolation();
          return;
        }
      }

      // Check admin privileges if required
      if (requireAdmin && user) {
        // This would need to be integrated with your admin check logic
        // For now, we'll assume admin check is handled elsewhere
      }

      setIsAuthorized(true);
    };

    if (!authLoading) {
      checkAuthorization();
    }
  }, [user, authLoading, requireAuth, requireAdmin, rateLimit, checkRateLimit, reportSecurityEvent, onSecurityViolation]);

  // Show loading state while checking authorization
  if (authLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
