
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthActions } from '@/hooks/useAuthActions';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { resetPassword } = useAuthActions();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Введите email адрес');
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Введите корректный email адрес');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log('Starting password reset process for:', email);
      await resetPassword(email);
      console.log('Password reset process completed successfully');
      setIsSubmitted(true);
      toast.success('Письмо для восстановления пароля отправлено');
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      setErrorMessage(error.message || "Не удалось отправить запрос на сброс пароля");
      toast.error(error.message || "Ошибка при отправке письма");
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
                  onClick={() => {
                    setIsSubmitted(false);
                    setErrorMessage(null);
                  }}
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
              <>
                {errorMessage && (
                  <div className="bg-red-50 p-3 rounded-lg mb-4 border border-red-100">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrorMessage(null); // Очищаем ошибку при вводе
                        }}
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default ForgotPasswordPage;
