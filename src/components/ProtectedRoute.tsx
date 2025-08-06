
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { Navigate } from 'react-router-dom';
import { isDevelopmentMode } from '@/utils/devMode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useSmartAuth();

  console.log('🔒 ProtectedRoute check:', { 
    user: !!user, 
    isLoading, 
    userId: user?.id,
    route: window.location.pathname 
  });

  // Show loading spinner while auth is initializing
  if (isLoading) {
    console.log('🔒 ProtectedRoute: showing loading...');
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Проверяем аутентификацию...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    console.log('🔒 ProtectedRoute: redirecting to login...');
    return <Navigate to="/login" replace />;
  }

  console.log('🔒 ProtectedRoute: rendering protected content...');
  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
