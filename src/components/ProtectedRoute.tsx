
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
    userId: user?.id,
    userNickname: user?.user_metadata?.nickname,
    isLoading,
    isDevMode,
    hostname: window.location.hostname,
    pathname: window.location.pathname
  });

  // Показываем загрузку только если данные еще загружаются
  if (isLoading) {
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

  // Если нет пользователя, перенаправляем на страницу входа
  if (!user) {
    console.log('🔒 No user found, redirecting to login from:', window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Если пользователь есть, отображаем защищенный контент
  console.log('🔒 User authenticated, rendering children for:', user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
