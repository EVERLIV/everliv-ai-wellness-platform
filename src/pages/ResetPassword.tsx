
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Reset password error:", error);
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
          <div className="w-16 h-16 bg-evergreen-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="h-8 w-8 text-evergreen-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
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
        </div>
      ) : (
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
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
