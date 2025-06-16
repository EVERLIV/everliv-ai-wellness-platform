
import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isDevelopmentMode } from '@/utils/devMode';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // В dev режиме всегда пропускаем проверку авторизации
    if (isDevelopmentMode()) {
      console.log('🔧 Dev mode: Bypassing auth guard');
      return;
    }

    if (!isLoading) {
      if (requireAuth && !user) {
        navigate(redirectTo);
      }
    }
  }, [user, isLoading, requireAuth, redirectTo, navigate]);

  // В dev режиме всегда показываем контент
  if (isDevelopmentMode()) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
