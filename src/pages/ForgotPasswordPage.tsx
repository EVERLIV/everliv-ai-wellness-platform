import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!email) {
      toast("Пожалуйста, введите свой email.", {
        description: "Email не может быть пустым."
      });
      setLoading(false);
      return;
    }

    const { success, error } = await resetPassword(email);

    if (success) {
      toast("Инструкции отправлены", {
        description: "Проверьте свою электронную почту, чтобы сбросить пароль."
      });
      navigate('/login');
    } else {
      toast("Не удалось отправить инструкции", {
        description: error?.message || "Произошла ошибка при отправке инструкций."
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Забыли пароль?</CardTitle>
          <CardDescription>
            Введите свой email, и мы отправим вам инструкции по сбросу пароля.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Отправка..." : "Сбросить пароль"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
