
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      await signIn(email, password);
      // Navigation will be handled by auth context
      console.log('Login successful, navigation handled by AuthContext');
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error cases
      if (error.message.includes('Email not confirmed')) {
        setError('Email не подтвержден. Пожалуйста, проверьте вашу электронную почту.');
      } else if (error.message.includes('Invalid login credentials')) {
        setError('Неверный email или пароль.');
      } else {
        setError(error.message || 'Ошибка при входе в систему');
      }
    }
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthLayout 
      title="Войти в EVERLIV" 
      description="Добро пожаловать! Пожалуйста, войдите в свой аккаунт."
      type="login"
    >
      {error && (
        <div className="bg-red-50 p-3 rounded-lg mb-6 border border-red-100">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
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
          <div className="flex justify-between">
            <Label htmlFor="password">Пароль</Label>
            <Link to="/forgot-password" className="text-sm text-everliv-600 hover:underline">
              Забыли пароль?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
