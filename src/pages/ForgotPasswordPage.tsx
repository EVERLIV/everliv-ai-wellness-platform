
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signInWithMagicLink } = useAuth();
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
      console.log('Requesting magic link for:', email);
      await signInWithMagicLink(email);
      console.log('Magic link request completed successfully');
      setIsSubmitted(true);
      toast.success('Ссылка для входа отправлена на почту');
    } catch (error: any) {
      console.error('Error requesting magic link:', error);
      setErrorMessage(error.message || "Не удалось отправить ссылку для входа");
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
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-2xl font-bold">
              {isSubmitted ? 'Проверьте почту' : 'Запросить ссылку для входа'}
            </CardTitle>
            <CardDescription className="text-lg">
              {isSubmitted 
                ? 'Мы отправили ссылку для входа на указанный email'
                : 'Введите ваш email адрес и мы отправим ссылку для входа'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSubmitted ? (
              <div className="text-center space-y-6">
                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  Ссылка отправлена на: <strong>{email}</strong>
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
                  className="w-full h-12"
                >
                  Отправить повторно
                </Button>
                <Link to="/login">
                  <Button variant="ghost" className="w-full h-12">
                    Вернуться к входу
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-base font-medium">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="example@email.com"
                        required
                        className="h-12 text-base"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Отправка...' : 'Отправить ссылку для входа'}
                    </Button>
                    <Link to="/login">
                      <Button variant="ghost" className="w-full h-12">
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
