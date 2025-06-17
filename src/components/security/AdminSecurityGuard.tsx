
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSecureAdminCheck } from '@/hooks/useSecureAdminCheck';
import { toast } from 'sonner';

interface AdminSecurityGuardProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
  redirectTo?: string;
}

export const AdminSecurityGuard = ({ 
  children, 
  requireSuperAdmin = false,
  redirectTo = '/dashboard' 
}: AdminSecurityGuardProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isSuperAdmin, isLoading: adminLoading } = useSecureAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      // Security: Check authentication first
      if (!user) {
        console.warn('🔒 Unauthorized access attempt to admin area');
        toast.error('Требуется авторизация для доступа к административной панели');
        navigate('/login');
        return;
      }

      // Security: Check admin privileges
      if (!isAdmin) {
        console.warn('🔒 Non-admin user attempted to access admin area:', user.id);
        toast.error('Недостаточно прав для доступа к административной панели');
        navigate(redirectTo);
        return;
      }

      // Security: Check super admin privileges if required
      if (requireSuperAdmin && !isSuperAdmin) {
        console.warn('🔒 Admin user attempted to access super-admin area:', user.id);
        toast.error('Требуются права суперадминистратора');
        navigate('/admin');
        return;
      }

      // Security: Log successful admin access
      console.log('🔒 Admin access granted:', {
        userId: user.id,
        isAdmin,
        isSuperAdmin,
        requireSuperAdmin
      });
    }
  }, [user, isAdmin, isSuperAdmin, authLoading, adminLoading, requireSuperAdmin, navigate, redirectTo]);

  // Security: Show loading state while checking permissions
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка прав доступа...</p>
        </div>
      </div>
    );
  }

  // Security: Block access if not authenticated or not admin
  if (!user || !isAdmin) {
    return null;
  }

  // Security: Block access if super admin required but user is not super admin
  if (requireSuperAdmin && !isSuperAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminSecurityGuard;
