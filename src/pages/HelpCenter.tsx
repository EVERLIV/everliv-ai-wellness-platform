
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Центр помощи</h1>
            <p className="text-xl text-gray-600">Мы здесь, чтобы помочь вам с любыми вопросами</p>
            
            <div className="mt-8 relative">
              <Input 
                type="text" 
                placeholder="Поиск ответов..." 
                className="w-full pl-12 pr-4 py-3 text-lg rounded-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          
          <Tabs defaultValue="common" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="common">Частые вопросы</TabsTrigger>
              <TabsTrigger value="technical">Технические проблемы</TabsTrigger>
              <TabsTrigger value="account">Аккаунт и оплата</TabsTrigger>
            </TabsList>
            
            <TabsContent value="common">
              <div className="grid gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <HelpCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Как начать использовать платформу EVERLIV?</h3>
                        <p className="text-gray-700">
                          Чтобы начать использовать платформу EVERLIV, зарегистрируйтесь на нашем сайте, заполните базовый профиль здоровья и выберите подходящий тариф. После этого вы получите доступ к персонализированным рекомендациям и инструментам для улучшения здоровья.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <HelpCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Каковы преимущества премиум-подписки?</h3>
                        <p className="text-gray-700">
                          Премиум-подписка открывает доступ к расширенной аналитике здоровья, персонализированным протоколам оздоровления, консультациям со специалистами и регулярным отчетам о прогрессе. Вы также получаете приоритетную поддержку и эксклюзивный доступ к образовательным материалам.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <HelpCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Как интерпретировать результаты анализов?</h3>
                        <p className="text-gray-700">
                          После загрузки результатов анализов на платформу, наш ИИ автоматически интерпретирует их и представляет в понятном формате. Вы получите подробное объяснение каждого параметра, его влияние на ваше здоровье и рекомендации по улучшению показателей.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="technical">
              <div className="grid gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Не загружаются результаты анализов</h3>
                        <p className="text-gray-700">
                          Если у вас возникли проблемы с загрузкой результатов анализов, убедитесь, что файл в одном из поддерживаемых форматов (PDF, JPG, PNG) и размер не превышает 10 МБ. Также проверьте стабильность вашего интернет-соединения. Если проблема сохраняется, свяжитесь с нашей технической поддержкой.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Settings className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Приложение работает медленно или зависает</h3>
                        <p className="text-gray-700">
                          Для оптимальной работы платформы рекомендуем использовать последние версии браузеров Chrome, Firefox, Safari или Edge. Очистите кэш браузера и перезагрузите страницу. Если проблема сохраняется, попробуйте открыть платформу в режиме инкогнито или с другого устройства.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <User className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Не приходят уведомления</h3>
                        <p className="text-gray-700">
                          Проверьте настройки уведомлений в вашем профиле и убедитесь, что вы не отключили их. Также проверьте папку "Спам" в вашей электронной почте. Если уведомления все равно не приходят, обновите свой email в настройках профиля или свяжитесь с нашей службой поддержки.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="grid gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Lock className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Забыли пароль?</h3>
                        <p className="text-gray-700">
                          Если вы забыли пароль, воспользуйтесь функцией "Забыли пароль" на странице входа. Введите адрес электронной почты, связанный с вашей учетной записью, и мы отправим вам инструкции по сбросу пароля.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <CreditCard className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Проблемы с оплатой подписки</h3>
                        <p className="text-gray-700">
                          Если у вас возникли проблемы с оплатой подписки, убедитесь, что данные вашей карты актуальны и на счету достаточно средств. Проверьте, не заблокирован ли ваш банк онлайн-платежи. Если проблема сохраняется, свяжитесь с нашей службой поддержки, предоставив номер транзакции или скриншот ошибки.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <User className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Как изменить данные профиля?</h3>
                        <p className="text-gray-700">
                          Для изменения данных профиля войдите в свою учетную запись, перейдите в раздел "Настройки" или "Профиль" и внесите необходимые изменения. Не забудьте сохранить изменения, нажав соответствующую кнопку. Обратите внимание, что некоторые данные, связанные с результатами анализов и медицинской информацией, могут требовать дополнительной верификации.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="max-w-4xl mx-auto mt-16">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Свяжитесь с нами</h2>
                <p className="text-gray-700 mb-6">
                  Не нашли ответ на свой вопрос? Отправьте нам сообщение, и мы свяжемся с вами в ближайшее время.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium">
                        Ваше имя
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите ваше имя"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введите ваш email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                      Тема обращения
                    </label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
                    <label htmlFor="message" className="block mb-2 text-sm font-medium">
                      Ваше сообщение
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Опишите вашу проблему или вопрос подробно..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  
                  <div>
                    <Button type="submit" className="w-full">
                      Отправить сообщение
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
