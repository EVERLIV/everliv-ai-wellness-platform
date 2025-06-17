
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { InputSanitizer } from '@/utils/inputSanitizer';

interface SecureApiWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedActions?: string[];
}

export const SecureApiWrapper = ({ 
  children, 
  requireAuth = true, 
  allowedActions = [] 
}: SecureApiWrapperProps) => {
  const { user, session } = useAuth();

  useEffect(() => {
    // Security monitoring
    if (requireAuth && !user) {
      console.warn('🔒 Unauthorized access attempt blocked');
    }

    // Log security events
    if (user && allowedActions.length > 0) {
      console.log('🔒 Secure API wrapper activated for user:', user.id);
    }
  }, [user, requireAuth, allowedActions]);

  // Block access if authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Authentication required to access this resource.</p>
        </div>
      </div>
    );
  }

  // Additional security validations
  if (user && !InputSanitizer.isValidUUID(user.id)) {
    console.error('🔒 Invalid user ID detected');
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Security Error</h3>
          <p className="text-gray-600">Invalid user session detected.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SecureApiWrapper;
