
import { useAuth } from '@/contexts/SmartAuthContext';
import { Navigate } from 'react-router-dom';
import { isDevelopmentMode } from '@/utils/devMode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  console.log('🔧 ProtectedRoute check:', {
    isDev: isDevelopmentMode(),
    user: !!user,
    isLoading,
    hostname: window.location.hostname
  });

  // В dev режиме всегда пропускаем проверку авторизации - ПЕРВАЯ проверка!
  if (isDevelopmentMode()) {
    console.log('🔧 Dev mode: Bypassing auth check');
    return <>{children}</>;
  }

  if (isLoading) {
    console.log('🔧 Auth is loading...');
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-evergreen-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('🔧 No user found, redirecting to login');
    return <Navigate to="/login" />;
  }

  console.log('🔧 User authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
