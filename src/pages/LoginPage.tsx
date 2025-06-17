
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signInWithMagicLink } = useSmartAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email) {
      setErrorMessage('Пожалуйста, введите email');
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithMagicLink(email);
      // Покажем сообщение об успешной отправке
    } catch (error: any) {
      console.error('Error during login:', error);
      setErrorMessage(error.message || 'Ошибка при отправке ссылки. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
            <CardDescription className="text-lg">
              Введите ваш email для получения ссылки для входа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errorMessage && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Мы отправим вам ссылку для входа без пароля
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Отправляем...' : 'Отправить ссылку для входа'}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Нет аккаунта?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default LoginPage;
