
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useSmartAuth } from '@/hooks/useSmartAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const { signInWithMagicLink, isLoading, user } = useSmartAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    
    if (!email) {
      setErrorMessage('Пожалуйста, введите email');
      return;
    }
    
    try {
      await signInWithMagicLink(email);
      setLinkSent(true);
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message || 'Ошибка при отправке ссылки');
    }
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  if (linkSent) {
    return (
      <AuthLayout 
        title="Ссылка отправлена!" 
        description="Проверьте вашу почту для входа в систему."
        type="login"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-green-500" />
          </div>
          <p className="text-gray-600 mb-6">
            Мы отправили магическую ссылку на {email}. 
            Проверьте вашу почту и перейдите по ссылке для входа.
          </p>
          <Button 
            onClick={() => setLinkSent(false)} 
            variant="outline" 
            className="w-full"
          >
            Отправить другую ссылку
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Добро пожаловать!" 
      description="Введите ваш email для получения ссылки для входа без пароля."
      type="login"
    >
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
          className="w-full bg-everliv-600 hover:bg-everliv-700"
          disabled={isLoading}
        >
          {isLoading ? 'Отправляем...' : 'Получить ссылку для входа'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
