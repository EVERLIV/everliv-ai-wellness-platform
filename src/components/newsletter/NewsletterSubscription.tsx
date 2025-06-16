
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { Mail, Settings, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  subscribeToNewsletter, 
  unsubscribeFromNewsletter, 
  getNewsletterSubscription,
  updateNewsletterSubscription,
  NewsletterSubscription as SubscriptionType
} from '@/services/newsletter-service';

const NewsletterSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [categories, setCategories] = useState<string[]>(['general']);

  const availableCategories = [
    { id: 'general', label: 'Общие рекомендации' },
    { id: 'nutrition', label: 'Питание и добавки' },
    { id: 'exercise', label: 'Физическая активность' },
    { id: 'longevity', label: 'Longevity и антиэйджинг' },
    { id: 'mental', label: 'Ментальное здоровье' },
    { id: 'research', label: 'Новые исследования' }
  ];

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      setIsLoadingData(true);
      const data = await getNewsletterSubscription(user!.id);
      if (data) {
        setSubscription(data as SubscriptionType);
        setFrequency(data.frequency as 'weekly' | 'monthly');
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Ошибка загрузки подписки:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user?.email) return;
    
    try {
      setIsLoading(true);
      await subscribeToNewsletter(user.id, user.email, frequency, categories);
      await loadSubscription();
      toast.success('Вы успешно подписались на newsletter!');
    } catch (error) {
      console.error('Ошибка подписки:', error);
      toast.error('Ошибка при подписке на newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setIsLoading(true);
      await unsubscribeFromNewsletter(user!.id);
      setSubscription(null);
      toast.success('Вы отписались от newsletter');
    } catch (error) {
      console.error('Ошибка отписки:', error);
      toast.error('Ошибка при отписке от newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      setIsLoading(true);
      await updateNewsletterSubscription(user!.id, { frequency, categories });
      await loadSubscription();
      toast.success('Настройки newsletter обновлены!');
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
      toast.error('Ошибка при обновлении настроек');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setCategories(prev => [...prev, categoryId]);
    } else {
      setCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  if (isLoadingData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-everliv-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Загрузка...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Medical Newsletter
        </CardTitle>
        <CardDescription>
          Получайте еженедельные или ежемесячные медицинские рекомендации и новости науки
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {subscription ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Вы подписаны на newsletter</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="frequency">Частота отправки</Label>
                <Select 
                  value={frequency} 
                  onValueChange={(value: 'weekly' | 'monthly') => setFrequency(value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Выберите частоту" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Еженедельно</SelectItem>
                    <SelectItem value="monthly">Ежемесячно</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Категории интересов</Label>
                <div className="mt-3 space-y-2">
                  {availableCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={categories.includes(category.id)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={category.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleUpdateSettings}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {isLoading ? 'Сохранение...' : 'Обновить настройки'}
              </Button>
              <Button
                variant="outline"
                onClick={handleUnsubscribe}
                disabled={isLoading}
              >
                Отписаться
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="frequency">Частота отправки</Label>
              <Select 
                value={frequency} 
                onValueChange={(value: 'weekly' | 'monthly') => setFrequency(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Выберите частоту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Еженедельно</SelectItem>
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Категории интересов</Label>
              <div className="mt-3 space-y-2">
                {availableCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={categories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={category.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubscribe}
              disabled={isLoading || categories.length === 0}
              className="w-full"
            >
              {isLoading ? 'Подписываемся...' : 'Подписаться на newsletter'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterSubscription;
