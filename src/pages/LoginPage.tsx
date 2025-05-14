import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthLayout } from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast("Ошибка входа", {
          description: error.message
        });
        return;
      }

      toast("Успешный вход", {
        description: "Добро пожаловать обратно!"
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast("Ошибка", {
        description: "Произошла неожиданная ошибка при входе"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Войти в аккаунт</h2>
          <p className="text-muted-foreground">
            Введите свой адрес электронной почты и пароль, чтобы войти.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="адрес электронной почты"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? 'Входим...' : 'Войти'}
          </Button>
        </form>
        <p className="text-sm text-center">
          Забыли пароль? <Link to="/forgot-password" className="text-primary hover:underline">Сбросить пароль</Link>
        </p>
        <p className="text-sm text-center">
          Нет аккаунта? <Link to="/register" className="text-primary hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
