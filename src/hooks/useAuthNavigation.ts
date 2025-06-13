
import { useNavigate, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignInNavigation = (session: Session | null) => {
    setTimeout(() => {
      toast.success('Успешный вход в систему');
      
      // Only navigate if on auth pages or home page, but NOT on admin pages
      const isOnAuthPages = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';
      const isOnAdminPages = location.pathname.startsWith('/admin');
      
      if (isOnAuthPages && !isOnAdminPages) {
        // Check if this is first login ever for this user
        const isFirstLogin = !session?.user?.last_sign_in_at;
        if (isFirstLogin) {
          navigate('/welcome');
        } else {
          navigate('/dashboard');
        }
      }
    }, 0);
  };

  const handleSignOutNavigation = () => {
    setTimeout(() => {
      toast.info('Вы вышли из системы');
      navigate('/');
    }, 0);
  };

  const handlePasswordRecoveryNavigation = () => {
    setTimeout(() => {
      toast.info('Перенаправляем на страницу сброса пароля');
      navigate('/reset-password');
    }, 0);
  };

  const handleInitialSessionNavigation = (session: Session | null, isInitialized: boolean) => {
    // Only navigate on initial load if coming from auth pages and NOT on admin pages
    const isOnAuthPages = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';
    const isOnAdminPages = location.pathname.startsWith('/admin');
    
    if (session && !isInitialized && isOnAuthPages && !isOnAdminPages) {
      navigate('/dashboard');
    }
  };

  return {
    handleSignInNavigation,
    handleSignOutNavigation,
    handlePasswordRecoveryNavigation,
    handleInitialSessionNavigation,
  };
};
