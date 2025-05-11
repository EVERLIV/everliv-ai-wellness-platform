
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Clock } from 'lucide-react';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { signUp, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password) {
      return;
    }
    
    if (!agreedToTerms) {
      return;
    }

    // Split full name into first and last name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    try {
      await signUp(email, password, { 
        first_name: firstName,
        last_name: lastName
      });
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthLayout 
      title="Создать аккаунт" 
      description="Присоединяйтесь к EVERLIV и начните путь к оптимальному здоровью."
      type="signup"
    >
      <div className="bg-everliv-50 p-3 rounded-lg mb-6 border border-everliv-100">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-everliv-600 mr-2" />
          <p className="text-sm text-everliv-700">
            <span className="font-semibold">Бонус при регистрации:</span> Получите полный доступ к платформе на 24 часа бесплатно!
          </p>
        </div>
      </div>
    
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Имя и фамилия</Label>
          <Input
            id="name"
            type="text"
            placeholder="Иван Иванов"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
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
            minLength={8}
          />
          <p className="text-xs text-gray-500">
            Пароль должен содержать не менее 8 символов
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Я принимаю <a href="/terms" className="text-everliv-600 hover:underline">условия использования</a> и <a href="/privacy" className="text-everliv-600 hover:underline">политику конфиденциальности</a>
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-everliv-600 hover:bg-everliv-700"
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">Или продолжить с</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" className="w-full border-gray-300">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" type="button" className="w-full border-gray-300">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Facebook
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Signup;
