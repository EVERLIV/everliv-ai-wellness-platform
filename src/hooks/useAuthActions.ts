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
      
      if (error) {
        console.error('Magic link error details:', error);
        throw error;
      }
      
      toast.success('Магическая ссылка отправлена на вашу почту! Проверьте входящие сообщения.');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Magic link error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Ошибка отправки ссылки';
      if (error.message?.includes('fetch')) {
        errorMessage = 'Проблема с подключением к серверу';
      } else if (error.message?.includes('Invalid')) {
        errorMessage = 'Неверные данные для входа';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Signing in with email and password:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        console.error('Password login error details:', error);
        throw error;
      }
      
      console.log('Login successful:', data);
      toast.success('Успешный вход в систему!');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Password login error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Ошибка входа';
      if (error.message?.includes('fetch')) {
        errorMessage = 'Проблема с подключением к серверу';
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Неверный email или пароль';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
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
        password: Math.random().toString(36), 
        options: {
          data: {
            full_name: userData.nickname,
            nickname: userData.nickname
          },
          emailRedirectTo: getAuthConfirmUrl()
        }
      });
      
      if (error) throw error;

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
        }
      }

      try {
        await sendRegistrationConfirmationEmail(
          email,
          userData.nickname,
          getAuthConfirmUrl()
        );
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
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

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      console.log('Sending password reset email to:', email);
      
      const currentOrigin = window.location.origin;
      const redirectUrl = `${currentOrigin}/reset-password`;
      
      console.log('Reset password redirect URL:', redirectUrl);
      
      // Сначала используем встроенную функцию Supabase для отправки reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        console.error('Supabase reset password error:', error);
        throw error;
      }
      
      console.log('Password reset email sent successfully via Supabase');
      
      // Дополнительно пытаемся отправить кастомный email через edge function
      try {
        const { data, error: edgeError } = await supabase.functions.invoke('send-password-reset', {
          body: {
            email: email,
            resetUrl: redirectUrl
          }
        });
        
        if (edgeError) {
          console.error('Edge function error (but Supabase email was sent):', edgeError);
        } else {
          console.log('Custom password reset email sent successfully');
        }
      } catch (emailError) {
        console.error('Failed to send custom email (but Supabase email was sent):', emailError);
      }
      
      toast.success('Ссылка для сброса пароля отправлена на вашу почту!');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Ошибка отправки ссылки для сброса пароля');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      console.log('Updating user password');
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast.success('Пароль успешно обновлен!');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Ошибка обновления пароля');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Signing out user');
      
      // Clear any cached tokens before signing out
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('sb-') && key.includes('auth-token')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error('Error clearing tokens:', error);
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error);
      
      let errorMessage = 'Ошибка выхода из системы';
      if (error.message?.includes('fetch')) {
        errorMessage = 'Проблема с подключением к серверу';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signInWithMagicLink,
    signIn,
    signUpWithMagicLink,
    signOut,
    resetPassword,
    updatePassword,
  };
};
