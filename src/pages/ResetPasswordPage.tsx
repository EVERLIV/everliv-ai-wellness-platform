import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const accessToken = searchParams.get('access_token');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!accessToken) {
      toast("Ошибка", {
        description: "Отсутствует токен доступа. Пожалуйста, убедитесь, что вы перешли по правильной ссылке."
      });
      return;
    }

    if (password !== confirmPassword) {
      toast("Ошибка", {
        description: "Пароль и подтверждение пароля не совпадают."
      });
      return;
    }

    if (password.length < 6) {
      toast("Ошибка", {
        description: "Пароль должен содержать не менее 6 символов."
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
        access_token: accessToken,
      });

      if (error) {
        toast("Ошибка", {
          description: error.message || "Не удалось обновить пароль."
        });
      } else {
        toast("Пароль успешно обновлен", {
          description: "Теперь вы можете войти в систему с новым паролем."
        });
        navigate('/login');
      }
    } catch (error: any) {
      toast("Ошибка", {
        description: error.message || "Произошла ошибка при обновлении пароля."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Сброс пароля</CardTitle>
          <CardDescription className="text-center">
            Введите новый пароль для вашей учетной записи.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Новый пароль</Label>
              <Input
                type="password"
                id="password"
                placeholder="Новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button disabled={loading} className="w-full">
              {loading ? "Обновление..." : "Обновить пароль"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
