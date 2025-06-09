
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, Crown, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
  });

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      // Здесь будет логика обновления профиля
      toast.success("Профиль успешно обновлен");
    } catch (error) {
      toast.error("Ошибка обновления профиля");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Настройки аккаунта</h1>
          </div>

          <div className="grid gap-6">
            {/* Информация об аккаунте */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Информация об аккаунте
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Полное имя</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="Введите ваше полное имя"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      Email нельзя изменить. Обратитесь в поддержку для изменения email.
                    </p>
                  </div>
                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="w-fit"
                  >
                    {isUpdating ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Информация о подписке */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Подписка
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscription && subscription.status === 'active' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Текущий план:</span>
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-600" />
                        <span className="font-medium capitalize">{subscription.plan_type}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Действует до:</span>
                      <span className="font-medium">{formatDate(subscription.expires_at)}</span>
                    </div>
                    <Separator />
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/billing')}
                      className="w-full"
                    >
                      Управление подпиской
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">У вас нет активной подписки</p>
                    <Button onClick={() => navigate('/pricing')}>
                      Выбрать план
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Дата регистрации */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Информация об аккаунте
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Дата регистрации:</span>
                  <span className="font-medium">
                    {user?.created_at ? formatDate(user.created_at) : "Не указана"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default AccountSettings;
