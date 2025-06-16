
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { isDevelopmentMode, isStagingMode } from '@/utils/devMode';
import { secureLogger } from '@/utils/secureLogger';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  secureLogger.debug('ProtectedRoute check', {
    user_id: user?.id,
    isLoading,
    isDev: isDevelopmentMode(),
    isStaging: isStagingMode(),
    hostname: window.location.hostname
  });

  // В настоящем dev режиме (только localhost) пропускаем проверку авторизации
  if (isDevelopmentMode()) {
    secureLogger.debug('Development mode: Bypassing auth check');
    return <>{children}</>;
  }

  if (isLoading) {
    secureLogger.debug('Auth is loading...');
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-evergreen-500"></div>
      </div>
    );
  }

  if (!user) {
    secureLogger.info('No user found, redirecting to login');
    return <Navigate to="/login" />;
  }

  secureLogger.debug('User authenticated, rendering children', {
    user_id: user.id
  });
  return <>{children}</>;
};

export default ProtectedRoute;
