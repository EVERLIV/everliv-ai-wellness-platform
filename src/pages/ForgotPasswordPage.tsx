
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { resetPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    
    if (!email) {
      setErrorMessage('Введите email адрес');
      return;
    }
    
    console.log('Attempting to reset password for email:', email);
    
    try {
      await resetPassword(email);
      console.log('Password reset email sent successfully');
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setErrorMessage(error.message || 'Ошибка при отправке запроса на сброс пароля');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center pb-8">
            {isSubmitted ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-bold">Проверьте ваш email</CardTitle>
                <CardDescription className="text-lg">
                  Мы отправили инструкции по восстановлению пароля
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">Восстановление пароля</CardTitle>
                <CardDescription className="text-lg">
                  Введите ваш email для получения инструкций по восстановлению пароля
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Мы отправили инструкции по восстановлению пароля на{' '}
                  <span className="font-medium">{email}</span>.
                  Проверьте ваш почтовый ящик и следуйте инструкциям.
                </p>
                <p className="text-sm text-gray-500">
                  Не получили email? Проверьте спам-папку или{' '}
                  <button 
                    className="text-everliv-600 hover:underline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    попробуйте снова
                  </button>
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
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
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Отправка...' : 'Отправить инструкции'}
                  </Button>
                </form>
                
                <div className="text-center">
                  <Link to="/login" className="text-everliv-600 hover:underline font-medium">
                    Вернуться к входу
                  </Link>
                </div>
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
