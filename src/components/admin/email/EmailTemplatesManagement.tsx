
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  sendRegistrationConfirmationEmail, 
  sendAnalysisResultsEmail, 
  sendMedicalNewsletterEmail 
} from '@/services/email-service';
import { Mail, Send, Eye } from 'lucide-react';

const EmailTemplatesManagement = () => {
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendTestRegistrationEmail = async () => {
    if (!testEmail) {
      toast.error('Введите email для тестирования');
      return;
    }

    setIsLoading(true);
    try {
      await sendRegistrationConfirmationEmail(
        testEmail,
        'Тестовый Пользователь',
        'https://everliv.online/dashboard'
      );
      toast.success('Тестовое письмо подтверждения регистрации отправлено!');
    } catch (error: any) {
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestAnalysisEmail = async () => {
    if (!testEmail) {
      toast.error('Введите email для тестирования');
      return;
    }

    setIsLoading(true);
    try {
      await sendAnalysisResultsEmail(
        testEmail,
        'Тестовый Пользователь',
        'Биохимический анализ крови',
        'https://everliv.online/analysis-details/test',
        [
          'Уровень витамина D ниже нормы',
          'Повышенный холестерин',
          'Все остальные показатели в норме'
        ]
      );
      toast.success('Тестовое письмо с результатами анализа отправлено!');
    } catch (error: any) {
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNewsletterEmail = async () => {
    if (!testEmail) {
      toast.error('Введите email для тестирования');
      return;
    }

    setIsLoading(true);
    try {
      await sendMedicalNewsletterEmail(
        testEmail,
        'Тестовый Пользователь',
        [
          {
            title: 'Новые исследования по витамину D',
            summary: 'Ученые обнаружили связь между уровнем витамина D и иммунитетом...',
            url: 'https://everliv.online/blog/vitamin-d-research'
          },
          {
            title: 'Правильное питание для долголетия',
            summary: 'Средиземноморская диета показывает отличные результаты...',
            url: 'https://everliv.online/blog/mediterranean-diet'
          }
        ],
        [
          {
            icon: '💧',
            title: 'Пейте достаточно воды',
            description: 'Рекомендуется 30-35 мл на кг веса в день'
          },
          {
            icon: '🚶‍♂️',
            title: 'Ежедневные прогулки',
            description: 'Минимум 10 000 шагов в день для поддержания здоровья'
          },
          {
            icon: '😴',
            title: 'Качественный сон',
            description: '7-9 часов сна критически важны для восстановления'
          }
        ]
      );
      toast.success('Тестовый newsletter отправлен!');
    } catch (error: any) {
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Mail className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Email Шаблоны</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Тестирование Email Шаблонов</CardTitle>
          <CardDescription>
            Отправьте тестовые письма для проверки шаблонов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Email для тестирования</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>

            <Tabs defaultValue="registration" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="registration">Регистрация</TabsTrigger>
                <TabsTrigger value="analysis">Результаты</TabsTrigger>
                <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              </TabsList>

              <TabsContent value="registration" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Подтверждение регистрации</CardTitle>
                    <CardDescription>
                      Красивое приветственное письмо с кнопкой подтверждения
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        ✨ Брендированный дизайн<br/>
                        🎯 Четкий call-to-action<br/>
                        📱 Адаптивная верстка<br/>
                        💚 Информация о преимуществах EVERLIV
                      </p>
                      <Button 
                        onClick={sendTestRegistrationEmail}
                        disabled={isLoading}
                        className="w-full"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Отправить тестовое письмо
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Результаты анализов</CardTitle>
                    <CardDescription>
                      Уведомление о готовности результатов с ключевыми находками
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        📋 Информация о типе анализа<br/>
                        🔍 Ключевые находки<br/>
                        ⚠️ Медицинский дисклеймер<br/>
                        🔗 Ссылка на полные результаты
                      </p>
                      <Button 
                        onClick={sendTestAnalysisEmail}
                        disabled={isLoading}
                        className="w-full"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Отправить тестовое письмо
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="newsletter" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Медицинский Newsletter</CardTitle>
                    <CardDescription>
                      Еженедельная подборка статей и рекомендаций
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        📚 Новые медицинские статьи<br/>
                        💡 Персональные рекомендации<br/>
                        🚀 Call-to-action для анализов<br/>
                        📧 Опция отписки
                      </p>
                      <Button 
                        onClick={sendTestNewsletterEmail}
                        disabled={isLoading}
                        className="w-full"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Отправить тестовое письмо
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Настройка RESEND API</CardTitle>
          <CardDescription>
            Для работы email-шаблонов необходим API ключ от Resend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Инструкция по настройке:</h4>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Зарегистрируйтесь на <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline">resend.com</a></li>
                <li>2. Подтвердите домен в разделе <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="underline">Domains</a></li>
                <li>3. Создайте API ключ в разделе <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">API Keys</a></li>
                <li>4. Добавьте RESEND_API_KEY в настройки Supabase</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplatesManagement;
