
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { InputSanitizer } from '@/utils/inputSanitizer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RegistrationFormProps {
  onSuccess?: () => void;
}

const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Sanitize inputs
      const sanitizedEmail = InputSanitizer.sanitizeEmail(email);
      const sanitizedNickname = InputSanitizer.sanitizeString(nickname);

      // Validate inputs
      if (!InputSanitizer.isValidEmail(sanitizedEmail)) {
        setError('Пожалуйста, введите действительный email адрес');
        return;
      }

      if (!sanitizedNickname.trim()) {
        setError('Пожалуйста, введите никнейм');
        return;
      }

      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }

      if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        return;
      }

      // Check rate limiting
      if (!InputSanitizer.checkRateLimit('registration', 3, 300000)) {
        setError('Слишком много попыток регистрации. Попробуйте позже.');
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          data: {
            nickname: sanitizedNickname,
            full_name: sanitizedNickname
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        toast.success('Регистрация успешна! Проверьте почту для подтверждения.');
        onSuccess?.();
      }
    } catch (err) {
      setError('Произошла неожиданная ошибка. Попробуйте еще раз.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Создать аккаунт</CardTitle>
        <CardDescription>Зарегистрируйтесь для создания нового аккаунта</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="nickname">Никнейм</Label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Введите ваш никнейм"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Подтвердите пароль"
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
