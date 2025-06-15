
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return Promise.resolve();
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
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
