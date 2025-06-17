
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getAuthConfirmUrl } from '@/config/constants';
import { sendRegistrationConfirmationEmail } from '@/services/email-service';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signInWithMagicLink = async (email: string) => {
    try {
      setIsLoading(true);
      console.log('Sending magic link to email:', email);
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: getAuthConfirmUrl()
        }
      });
      
      if (error) throw error;
      
      toast.success('Магическая ссылка отправлена на вашу почту! Проверьте входящие сообщения.');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast.error(error.message || 'Ошибка отправки ссылки');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithMagicLink = async (email: string, userData: { nickname: string }) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password: Math.random().toString(36), // Временный пароль, не используется
        options: {
          data: {
            full_name: userData.nickname,
            nickname: userData.nickname
          },
          emailRedirectTo: getAuthConfirmUrl()
        }
      });
      
      if (error) throw error;

      // Если пользователь создан, создаем запись в профиле
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            nickname: userData.nickname,
            first_name: userData.nickname
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Не прерываем процесс регистрации из-за ошибки профиля
        }
      }

      // Отправляем welcome email после успешной регистрации
      try {
        await sendRegistrationConfirmationEmail(
          email,
          userData.nickname,
          getAuthConfirmUrl()
        );
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Не прерываем процесс регистрации из-за ошибки email
      }
      
      toast.success('Ссылка для подтверждения отправлена на вашу почту!');
      navigate('/welcome');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Ошибка регистрации');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Ошибка выхода из системы');
    } finally {
      setIsLoading(false);
    }
  };

  // Для совместимости со старыми страницами - перенаправляем на magic link
  const resetPassword = async (email: string) => {
    return signInWithMagicLink(email);
  };

  // Для совместимости - перенаправляем на magic link
  const signIn = async (email: string, password: string) => {
    return signInWithMagicLink(email);
  };

  // Заглушка для updatePassword - показываем что функция недоступна
  const updatePassword = async (password: string) => {
    toast.error('Обновление пароля недоступно. Используйте вход по ссылке.');
    throw new Error('Password update not available with magic link auth');
  };

  return {
    isLoading,
    signInWithMagicLink,
    signUpWithMagicLink,
    signOut,
    resetPassword,
    signIn,
    updatePassword,
  };
};
