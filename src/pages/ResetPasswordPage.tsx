
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ResetPasswordPageProps {}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [location.search]);

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Ошибка", {
        description: "Пароли не совпадают"
      });
      return;
    }

    setLoading(true);
    try {
      // Use updateUser instead of older API
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error("Ошибка сброса пароля", {
          description: error.message
        });
        return;
      }

      toast.success("Успешно", {
        description: "Ваш пароль был успешно сброшен"
      });
      navigate('/login');
    } catch (error: any) {
      toast.error("Ошибка", {
        description: "Произошла неожиданная ошибка"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Сброс пароля"
      description="Введите новый пароль для вашей учетной записи."
      type="reset"
    >
      <div className="space-y-6">
        <form onSubmit={resetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Новый пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? 'Сброс...' : 'Сбросить пароль'}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
