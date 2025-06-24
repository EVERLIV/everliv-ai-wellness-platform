
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { Navigate } from 'react-router-dom';
import { isDevelopmentMode } from '@/utils/devMode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useSmartAuth();
  const isDevMode = isDevelopmentMode();

  console.log('🔒 ProtectedRoute check:', {
    user: !!user,
    userEmail: user?.email,
    userNickname: user?.user_metadata?.nickname,
    isLoading,
    isDevMode,
    hostname: window.location.hostname,
    pathname: window.location.pathname
  });

  // В dev режиме сокращаем время ожидания
  if (isLoading && !isDevMode) {
    console.log('🔒 Auth is loading...');
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-evergreen-500"></div>
          <p className="text-gray-500">Проверяем аутентификацию...</p>
        </div>
      </div>
    );
  }

  // В dev режиме, если нет пользователя, пытаемся создать dev пользователя
  if (!user && isDevMode) {
    console.log('🔒 Dev mode: No user found, but allowing access for development');
    // В dev режиме позволяем доступ даже без пользователя
    return <>{children}</>;
  }

  if (!user) {
    console.log('🔒 No user found, redirecting to login from:', window.location.pathname);
    return <Navigate to="/login" />;
  }

  console.log('🔒 User authenticated, rendering children for:', user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
