
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { AlertCircle, Mail } from 'lucide-react';

const MagicLinkLoginPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const { signInWithMagicLink, user } = useSmartAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

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
      setLinkSent(true);
    } catch (error: any) {
      console.error('Error during magic link login:', error);
      setErrorMessage(error.message || 'Ошибка при отправке ссылки. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  if (linkSent) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-grow flex items-center justify-center px-4" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Ссылка отправлена!</CardTitle>
              <CardDescription>
                Мы отправили магическую ссылку на {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Проверьте вашу почту и перейдите по ссылке для входа в систему.
              </p>
              <Button 
                onClick={() => setLinkSent(false)} 
                variant="outline" 
                className="w-full"
              >
                Отправить другую ссылку
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
            <CardDescription className="text-center">
              Введите ваш email для получения магической ссылки
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="bg-red-50 p-3 rounded-lg mb-6 border border-red-100">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Мы отправим вам ссылку для входа без пароля
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Отправляем...' : 'Отправить магическую ссылку'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
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

export default MagicLinkLoginPage;
