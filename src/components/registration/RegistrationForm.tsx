
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const RegistrationForm = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signUp, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    
    if (!nickname || !email || !password) {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }
    
    if (!agreedToTerms) {
      setErrorMessage('Пожалуйста, примите условия использования');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Пароль должен содержать не менее 6 символов');
      return;
    }
    
    try {
      await signUp(email, password, { 
        nickname: nickname
      });
      toast.success('Регистрация успешна! Проверьте вашу электронную почту для подтверждения.');
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === 'over_email_send_rate_limit') {
        setErrorMessage('Пожалуйста, подождите минуту перед повторной попыткой регистрации');
      } else {
        setErrorMessage(error.message || 'Ошибка при регистрации. Пожалуйста, попробуйте позже.');
      }
    }
  };

  return (
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
          <Label htmlFor="nickname">Никнейм</Label>
          <Input
            id="nickname"
            type="text"
            placeholder="Ваш никнейм"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
            minLength={6}
          />
          <p className="text-xs text-gray-500">
            Пароль должен содержать не менее 6 символов
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
      </form>
    </>
  );
};

export default RegistrationForm;
