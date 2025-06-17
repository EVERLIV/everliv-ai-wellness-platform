
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useSmartAuth();

  console.log('🔒 ProtectedRoute check:', {
    user: !!user,
    userEmail: user?.email,
    userNickname: user?.user_metadata?.nickname,
    isLoading,
    hostname: window.location.hostname,
    pathname: window.location.pathname
  });

  if (isLoading) {
    console.log('🔒 Auth is loading...');
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-evergreen-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('🔒 No user found, redirecting to login from:', window.location.pathname);
    return <Navigate to="/login" />;
  }

  console.log('🔒 User authenticated, rendering children for:', user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
