
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  HelpCircle, 
  CreditCard, 
  Lock, 
  User, 
  Settings, 
  AlertTriangle
} from 'lucide-react';

const HelpCenter = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log({ name, email, subject, message });
    alert('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };
  
  return (
    <AppLayout>
      <div className="bg-gray-50 -mx-2 -mt-6 mb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Центр помощи</h1>
            <p className="text-base text-gray-600">Часто задаваемые вопросы</p>
            
            <div className="mt-6 relative">
              <Input 
                type="text" 
                placeholder="Поиск ответов..." 
                className="w-full pl-10 pr-4 py-2 text-sm rounded-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid gap-3">
              {/* Общие вопросы */}
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Как начать использовать платформу EVERLIV?</h3>
                      <p className="text-xs text-gray-700">
                        Зарегистрируйтесь на сайте, заполните базовый профиль здоровья и выберите подходящий тариф. После этого вы получите доступ к персонализированным рекомендациям.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Каковы преимущества премиум-подписки?</h3>
                      <p className="text-xs text-gray-700">
                        Премиум-подписка открывает доступ к расширенной аналитике здоровья, персонализированным протоколам оздоровления, консультациям со специалистами и приоритетной поддержке.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Как интерпретировать результаты анализов?</h3>
                      <p className="text-xs text-gray-700">
                        После загрузки результатов анализов наш ИИ автоматически интерпретирует их и представляет в понятном формате с подробными объяснениями и рекомендациями.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Технические проблемы */}
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Не загружаются результаты анализов</h3>
                      <p className="text-xs text-gray-700">
                        Убедитесь, что файл в поддерживаемом формате (PDF, JPG, PNG) и размер не превышает 10 МБ. Проверьте интернет-соединение. При проблемах свяжитесь с поддержкой.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Settings className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Приложение работает медленно или зависает</h3>
                      <p className="text-xs text-gray-700">
                        Используйте последние версии браузеров Chrome, Firefox, Safari или Edge. Очистите кэш браузера и перезагрузите страницу.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Не приходят уведомления</h3>
                      <p className="text-xs text-gray-700">
                        Проверьте настройки уведомлений в профиле и папку "Спам" в почте. Обновите email в настройках или свяжитесь с поддержкой.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Аккаунт и оплата */}
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Lock className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Забыли пароль?</h3>
                      <p className="text-xs text-gray-700">
                        Воспользуйтесь функцией "Забыли пароль" на странице входа. Введите email и мы отправим инструкции по сбросу пароля.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Проблемы с оплатой подписки</h3>
                      <p className="text-xs text-gray-700">
                        Убедитесь, что данные карты актуальны и на счету достаточно средств. Проверьте, не заблокированы ли онлайн-платежи банком.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-none border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Как изменить данные профиля?</h3>
                      <p className="text-xs text-gray-700">
                        Войдите в учетную запись, перейдите в "Настройки" или "Профиль" и внесите изменения. Не забудьте сохранить изменения.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="rounded-none border-gray-200">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold mb-4">Свяжитесь с нами</h2>
                <p className="text-sm text-gray-700 mb-4">
                  Не нашли ответ на свой вопрос? Отправьте нам сообщение.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block mb-1 text-xs font-medium">
                        Ваше имя
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите ваше имя"
                        className="h-8 text-xs rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-1 text-xs font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введите ваш email"
                        className="h-8 text-xs rounded-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-1 text-xs font-medium">
                      Тема обращения
                    </label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Выберите тему</option>
                      <option value="technical">Техническая проблема</option>
                      <option value="account">Аккаунт и подписка</option>
                      <option value="billing">Вопросы оплаты</option>
                      <option value="data">Вопросы по данным</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-1 text-xs font-medium">
                      Ваше сообщение
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Опишите вашу проблему или вопрос подробно..."
                      className="min-h-[100px] text-xs rounded-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <Button type="submit" className="w-full h-8 text-xs rounded-none">
                      Отправить сообщение
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HelpCenter;
