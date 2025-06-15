
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthActions } from '@/hooks/useAuthActions';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [searchParams] = useSearchParams();
  const { updatePassword } = useAuthActions();
  const navigate = useNavigate();

  // Проверяем наличие токена в URL и устанавливаем сессию
  useEffect(() => {
    const checkTokenFromUrl = async () => {
      console.log('Checking URL for recovery tokens...');
      
      // Получаем все параметры из URL
      const currentUrl = window.location.href;
      console.log('Current URL:', currentUrl);
      
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let type: string | null = null;
      
      // Проверяем, есть ли токены в URL (могут быть в hash или query)
      if (currentUrl.includes('access_token=')) {
        const urlParams = new URLSearchParams(currentUrl.split('#')[1] || currentUrl.split('?')[1]);
        accessToken = urlParams.get('access_token');
        refreshToken = urlParams.get('refresh_token');
        type = urlParams.get('type');
      } else {
        // Проверяем searchParams
        accessToken = searchParams.get('access_token');
        refreshToken = searchParams.get('refresh_token');
        type = searchParams.get('type');
      }
      
      console.log('Token check results:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        type 
      });
      
      if (accessToken && refreshToken && type === 'recovery') {
        try {
          console.log('Setting session with recovery tokens...');
          
          // Устанавливаем сессию с полученными токенами
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Error setting session:', error);
            toast.error('Недействительная ссылка для сброса пароля');
            navigate('/forgot-password');
          } else {
            console.log('Session set successfully:', data);
            setIsValidToken(true);
            
            // Очищаем URL от токенов для безопасности
            window.history.replaceState({}, document.title, '/reset-password');
          }
        } catch (error) {
          console.error('Error processing tokens:', error);
          toast.error('Ошибка обработки токена восстановления');
          navigate('/forgot-password');
        }
      } else {
        console.log('No valid recovery tokens found in URL');
        toast.error('Недействительная ссылка для сброса пароля. Пожалуйста, запросите новую ссылку.');
        navigate('/forgot-password');
      }
      
      setIsCheckingToken(false);
    };

    checkTokenFromUrl();
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

  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gray-50 py-24 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Проверка ссылки...</CardTitle>
              <CardDescription className="text-center">
                Проверяем действительность ссылки для сброса пароля
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
              <p className="text-gray-600">
                Пожалуйста, подождите...
              </p>
            </CardContent>
          </Card>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gray-50 py-24 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-red-600">Ссылка недействительна</CardTitle>
              <CardDescription className="text-center">
                Ссылка для восстановления пароля недействительна или истекла
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <p className="text-gray-600 mb-4">
                Пожалуйста, запросите новую ссылку для восстановления пароля
              </p>
              <Button onClick={() => navigate('/forgot-password')} className="w-full">
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
