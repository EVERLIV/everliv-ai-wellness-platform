
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message || 'Неверный email или пароль');
    }
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthLayout 
      title="Добро пожаловать!" 
      description="Войдите в свой аккаунт для доступа к персональным рекомендациям по здоровью."
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="text-right">
          <Link 
            to="/forgot-password" 
            className="text-sm text-everliv-600 hover:underline"
          >
            Забыли пароль?
          </Link>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-everliv-600 hover:bg-everliv-700"
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
