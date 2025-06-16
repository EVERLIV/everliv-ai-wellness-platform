
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const { signUp, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    try {
      await signUp(email, password);
      setLinkSent(true);
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorMessage(error.message || 'Ошибка при регистрации');
    }
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  if (linkSent) {
    return (
      <AuthLayout 
        title="Проверьте вашу почту!" 
        description="Мы отправили ссылку для подтверждения регистрации."
        type="signup"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-green-500" />
          </div>
          <p className="text-gray-600 mb-6">
            Мы отправили письмо на {email}. 
            Проверьте вашу почту и перейдите по ссылке для подтверждения регистрации.
          </p>
          <Button 
            onClick={() => setLinkSent(false)} 
            variant="outline" 
            className="w-full"
          >
            Изменить email
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Создать аккаунт" 
      description="Зарегистрируйтесь для доступа к персонализированной медицине."
      type="signup"
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Войти
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
