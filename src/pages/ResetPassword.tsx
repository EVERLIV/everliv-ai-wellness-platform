
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { resetPassword, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    
    if (!email) {
      setErrorMessage('Введите email адрес');
      return;
    }
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setErrorMessage(error.message || 'Ошибка при отправке запроса на сброс пароля');
    }
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthLayout 
      title="Восстановление пароля" 
      description="Введите ваш email для получения инструкций по восстановлению пароля."
      type="reset"
    >
      {isSubmitted ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">Проверьте ваш email</h3>
          <p className="text-gray-600">
            Мы отправили инструкции по восстановлению пароля на <span className="font-medium">{email}</span>. 
            Проверьте ваш почтовый ящик и следуйте инструкциям.
          </p>
          <p className="text-sm text-gray-500 mt-6">
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
              Вернуться к входу
            </Button>
          </Link>
        </div>
      ) : (
        <>
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
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-everliv-600 hover:bg-everliv-700"
              disabled={isLoading}
            >
              {isLoading ? 'Отправка...' : 'Отправить инструкции'}
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
