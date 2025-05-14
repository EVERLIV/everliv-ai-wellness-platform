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
const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    signUp
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { error } = await signUp(email, password);
      
      if (error) {
        throw error;
      }
      
      toast.success('Регистрация прошла успешно! Пожалуйста, проверьте email для подтверждения аккаунта.');
      navigate('/login');
    } catch (error: any) {
      console.error('Ошибка при регистрации:', error);
      toast.error(error?.message || 'Не удалось зарегистрироваться. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen flex flex-col">
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
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
                  {isLoading || isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
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
    </div>;
};
export default RegistrationPage;
