import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [authMethod, setAuthMethod] = useState<'magic-link' | 'password'>('password');
  const { signInWithMagicLink, signIn, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    
    if (!email) {
      setErrorMessage('Пожалуйста, введите email');
      return;
    }

    if (authMethod === 'password' && !password) {
      setErrorMessage('Пожалуйста, введите пароль');
      return;
    }
    
    try {
      if (authMethod === 'magic-link') {
        await signInWithMagicLink(email);
        setLinkSent(true);
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message || 'Ошибка при входе в систему');
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
      description="Войдите в свой аккаунт удобным способом."
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

      {/* Auth Method Selector */}
      <div className="mb-6">
        <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            type="button"
            onClick={() => setAuthMethod('password')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              authMethod === 'password'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Пароль
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('magic-link')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              authMethod === 'magic-link'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ссылка на email
          </button>
        </div>
      </div>
    
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

        {authMethod === 'password' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Пароль</Label>
              <Link
                to="/reset-password"
                className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
              >
                Забыли пароль?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {authMethod === 'magic-link' && (
          <p className="text-xs text-gray-500">
            Мы отправим вам ссылку для входа без пароля
          </p>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? 'Обработка...' : 
           authMethod === 'magic-link' ? 'Получить ссылку для входа' : 'Войти'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
