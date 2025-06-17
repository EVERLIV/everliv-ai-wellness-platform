
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useProfile } from "@/hooks/useProfile";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import SettingsHeader from "@/components/settings/SettingsHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Crown, Mail, Bell, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { profileData, updateProfile, isUpdating } = useProfile();
  
  const [userSettings, setUserSettings] = useState({
    nickname: "",
    email: user?.email || "",
    emailNotifications: true,
    pushNotifications: true,
    newsletterSubscription: true,
    healthTipsEmails: true,
    weeklyReports: true
  });

  // Загружаем данные профиля при инициализации
  useEffect(() => {
    if (profileData) {
      setUserSettings(prev => ({
        ...prev,
        nickname: profileData.nickname || profileData.first_name || user?.user_metadata?.full_name || ""
      }));
    }
  }, [profileData, user]);

  const handleUpdateProfile = async () => {
    if (!userSettings.nickname.trim()) {
      toast.error("Пожалуйста, введите никнейм");
      return;
    }

    const success = await updateProfile({
      nickname: userSettings.nickname.trim()
    });

    if (success) {
      toast.success("Настройки успешно сохранены");
    }
  };

  const getCurrentPlan = () => {
    if (subscription && subscription.status === 'active') {
      const now = new Date();
      const expiresAt = new Date(subscription.expires_at);
      
      if (expiresAt > now) {
        switch (subscription.plan_type) {
          case 'premium':
            return 'Премиум';
          case 'standard':
            return 'Стандарт';
          case 'basic':
            return 'Базовый';
          default:
            return 'Базовый';
        }
      }
    }
    return 'Базовый';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const currentPlan = getCurrentPlan();
  const hasActiveSubscription = currentPlan !== "Базовый";

  return (
    <PageLayoutWithHeader
      headerComponent={<SettingsHeader />}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Данные пользователя */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Данные пользователя
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nickname">Никнейм</Label>
                <Input
                  id="nickname"
                  value={userSettings.nickname}
                  onChange={(e) => setUserSettings({...userSettings, nickname: e.target.value})}
                  placeholder="Введите ваш никнейм"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={userSettings.email}
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

        {/* Подписка */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Подписка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {hasActiveSubscription && <Crown className="h-4 w-4 text-amber-600" />}
                    <span className="font-medium">Текущий план: {currentPlan}</span>
                  </div>
                  {subscription && subscription.status === 'active' && (
                    <p className="text-sm text-gray-600">
                      Действует до: {formatDate(subscription.expires_at)}
                    </p>
                  )}
                </div>
                <Button variant="outline" onClick={() => window.location.href = '/subscription'}>
                  Управление
                </Button>
              </div>
              {!hasActiveSubscription && (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Откройте больше возможностей с премиум-планом</p>
                  <Button onClick={() => window.location.href = '/pricing'}>
                    Выбрать план
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Новости */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Новости и рассылки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Подписка на новости</p>
                <p className="text-sm text-gray-600">Получайте последние новости о здоровье</p>
              </div>
              <Switch
                checked={userSettings.newsletterSubscription}
                onCheckedChange={(checked) => 
                  setUserSettings({...userSettings, newsletterSubscription: checked})
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Еженедельные отчеты</p>
                <p className="text-sm text-gray-600">Сводка ваших показателей здоровья</p>
              </div>
              <Switch
                checked={userSettings.weeklyReports}
                onCheckedChange={(checked) => 
                  setUserSettings({...userSettings, weeklyReports: checked})
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Советы по здоровью</p>
                <p className="text-sm text-gray-600">Персональные рекомендации на email</p>
              </div>
              <Switch
                checked={userSettings.healthTipsEmails}
                onCheckedChange={(checked) => 
                  setUserSettings({...userSettings, healthTipsEmails: checked})
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Уведомления */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email уведомления</p>
                <p className="text-sm text-gray-600">Важные обновления и напоминания</p>
              </div>
              <Switch
                checked={userSettings.emailNotifications}
                onCheckedChange={(checked) => 
                  setUserSettings({...userSettings, emailNotifications: checked})
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push уведомления</p>
                <p className="text-sm text-gray-600">Уведомления в браузере</p>
              </div>
              <Switch
                checked={userSettings.pushNotifications}
                onCheckedChange={(checked) => 
                  setUserSettings({...userSettings, pushNotifications: checked})
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleUpdateProfile} disabled={isUpdating}>
            {isUpdating ? "Сохранение..." : "Сохранить все настройки"}
          </Button>
        </div>
      </div>
    </PageLayoutWithHeader>
  );
};

export default Settings;
