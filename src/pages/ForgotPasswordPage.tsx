
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Ошибка",
        description: "Введите email адрес",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить запрос на сброс пароля",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-24 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSubmitted ? 'Проверьте почту' : 'Забыли пароль?'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSubmitted 
                ? 'Мы отправили инструкции по восстановлению пароля на указанный email'
                : 'Введите ваш email адрес и мы отправим инструкции по восстановлению пароля'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600">
                  Письмо отправлено на: <strong>{email}</strong>
                </div>
                <div className="text-sm text-gray-500">
                  Не получили письмо? Проверьте папку "Спам" или попробуйте еще раз
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  Отправить повторно
                </Button>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Вернуться к входу
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Отправка...' : 'Отправить инструкции'}
                  </Button>
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      Вернуться к входу
                    </Button>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default ForgotPasswordPage;
