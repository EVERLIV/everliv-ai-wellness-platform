
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthConfirm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthConfirm = async () => {
      try {
        // Получаем токены из URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth confirmation error:', error);
          toast.error('Ошибка подтверждения входа');
          navigate('/login');
          return;
        }

        if (data.session) {
          console.log('Auth confirmed successfully, user:', data.session.user.email);
          toast.success('Вы успешно вошли в систему!');
          
          // Проверяем, первый ли это вход пользователя
          const isFirstLogin = !data.session.user.last_sign_in_at;
          
          if (isFirstLogin) {
            navigate('/welcome');
          } else {
            navigate('/dashboard');
          }
        } else {
          // Если сессии нет, перенаправляем на страницу входа
          navigate('/login');
        }
      } catch (error) {
        console.error('Unexpected error during auth confirmation:', error);
        toast.error('Произошла ошибка при входе');
        navigate('/login');
      }
    };

    handleAuthConfirm();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Подтверждаем вход в систему...</p>
      </div>
    </div>
  );
};

export default AuthConfirm;
