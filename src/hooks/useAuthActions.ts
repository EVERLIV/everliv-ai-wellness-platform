
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      console.log('Login successful, navigation will be handled by auth state change');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Ошибка входа');
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: { nickname: string }) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });
      
      if (error) throw error;
      
      toast.success('Регистрация успешна! На вашу почту отправлено письмо для подтверждения.');
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

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting password reset for email:', email);
      console.log('Current origin:', window.location.origin);
      
      const redirectTo = `${window.location.origin}/reset-password`;
      console.log('Redirect URL:', redirectTo);
      
      const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });
      
      console.log('Password reset response:', { error, data });
      
      if (error) {
        console.error('Password reset error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
          details: error
        });
        throw error;
      }
      
      console.log('Password reset email sent successfully');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      // Предоставим более понятные сообщения об ошибках
      let errorMessage = 'Не удалось отправить письмо для восстановления пароля';
      
      if (error.message?.includes('SMTP')) {
        errorMessage = 'Проблема с настройками почты. Обратитесь к администратору.';
      } else if (error.message?.includes('Invalid')) {
        errorMessage = 'Неверный email адрес';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'Слишком много запросов. Попробуйте позже.';
      } else if (error.message?.includes('User not found')) {
        errorMessage = 'Пользователь с таким email не найден';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return Promise.resolve();
    } catch (error: any) {
      console.error('Update password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
};
