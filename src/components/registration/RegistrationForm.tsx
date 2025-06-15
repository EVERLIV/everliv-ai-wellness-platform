
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const RegistrationForm = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const { signUpWithMagicLink, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    
    if (!nickname || !email) {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }
    
    if (!agreedToTerms) {
      setErrorMessage('Пожалуйста, примите условия использования');
      return;
    }
    
    try {
      await signUpWithMagicLink(email, { 
        nickname: nickname
      });
      setLinkSent(true);
      toast.success('Ссылка для подтверждения отправлена на вашу почту!');
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === 'over_email_send_rate_limit') {
        setErrorMessage('Пожалуйста, подождите минуту перед повторной попыткой регистрации');
      } else {
        setErrorMessage(error.message || 'Ошибка при регистрации. Пожалуйста, попробуйте позже.');
      }
    }
  };

  if (linkSent) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Mail className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Ссылка отправлена!</h2>
        <p className="text-gray-600 mb-6">
          Мы отправили ссылку для подтверждения на {email}. 
          Проверьте вашу почту и перейдите по ссылке для завершения регистрации.
        </p>
        <Button 
          onClick={() => setLinkSent(false)} 
          variant="outline" 
          className="w-full"
        >
          Отправить другую ссылку
        </Button>
      </div>
    );
  }

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
          <p className="text-xs text-gray-500">
            Мы отправим ссылку для подтверждения без пароля
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
          {isLoading ? 'Отправляем ссылку...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </>
  );
};

export default RegistrationForm;
