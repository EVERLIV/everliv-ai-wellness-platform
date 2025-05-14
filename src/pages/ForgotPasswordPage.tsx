
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
      toast("Запрос отправлен", {
        description: "Проверьте вашу электронную почту для инструкций по сбросу пароля",
      });
    } catch (error: any) {
      console.error('Error during password reset request:', error);
      toast("Ошибка", {
        description: error.message || "Не удалось отправить запрос на сброс пароля. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-16 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Восстановление пароля</CardTitle>
            <CardDescription className="text-center">
              {isSubmitted 
                ? "Инструкции по сбросу пароля отправлены на вашу почту" 
                : "Введите адрес электронной почты для сброса пароля"
              }
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
            <>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com" 
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
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm">
                  <Link to="/login" className="text-primary hover:underline">
                    Вернуться к входу
                  </Link>
                </div>
              </CardFooter>
            </>
          ) : (
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <p className="text-center text-sm text-gray-500 mb-4">
                Проверьте вашу электронную почту для получения инструкций по сбросу пароля.
                Если вы не получили письмо, проверьте папку "Спам".
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Вернуться к странице входа
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
