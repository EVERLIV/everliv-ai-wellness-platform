
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [searchParams] = useSearchParams();
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  // Проверяем наличие токена в URL
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    if (accessToken && refreshToken && type === 'recovery') {
      setIsValidToken(true);
      // Устанавливаем сессию с полученными токенами
      // Supabase автоматически обработает это при загрузке страницы
    } else {
      toast.error('Недействительная ссылка для сброса пароля. Пожалуйста, запросите новую ссылку.');
      navigate('/forgot-password');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);
      
      toast.success('Ваш пароль был успешно обновлен');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Не удалось сбросить пароль. Попробуйте позже или запросите новую ссылку для сброса.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gray-50 py-24 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-red-600">Ошибка</CardTitle>
              <CardDescription className="text-center">
                Недействительная ссылка для сброса пароля
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <p className="text-gray-600 mb-4">
                Эта ссылка недействительна или истекла. Пожалуйста, запросите новую ссылку для сброса пароля.
              </p>
              <Button 
                onClick={() => navigate('/forgot-password')}
                className="w-full"
              >
                Запросить новую ссылку
              </Button>
            </CardContent>
          </Card>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-24 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Сброс пароля</CardTitle>
            <CardDescription className="text-center">
              Введите новый пароль для вашего аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Новый пароль</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Подтвердите новый пароль"
                    required
                    minLength={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Сохранение...' : 'Сохранить новый пароль'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default ResetPasswordPage;
