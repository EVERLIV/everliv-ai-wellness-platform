
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Пароль должен содержать не менее 6 символов');
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email, password, {
        first_name: firstName,
        last_name: lastName
      });
      toast({
        title: "Регистрация успешна",
        description: "Проверьте вашу электронную почту для подтверждения."
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Error during registration:', error);
      if (error.code === 'over_email_send_rate_limit') {
        setErrorMessage('Пожалуйста, подождите минуту перед повторной попыткой регистрации');
      } else {
        setErrorMessage(error.message || 'Ошибка при регистрации. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-16 px-4">
        <Card className="w-full max-w-md py-0 my-[100px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Регистрация</CardTitle>
            <CardDescription className="text-center">
              Создайте аккаунт для доступа к сервисам
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="bg-red-50 p-3 rounded-lg mb-6 border border-red-100">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <Input id="firstName" type="text" placeholder="Иван" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input id="lastName" type="text" placeholder="Иванов" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                  <p className="text-xs text-gray-500">
                    Пароль должен содержать не менее 6 символов
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center text-sm w-full">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Войти
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrationPage;
