
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Shield } from 'lucide-react';

const DeliveryInfo = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">Информация о предоставлении услуг</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Truck className="h-6 w-6 text-everliv-600 mr-3" />
                <h2 className="text-xl font-semibold">Порядок оказания услуг</h2>
              </div>
              <div className="space-y-4">
                <p>
                  Все услуги платформы EVERLIV предоставляются онлайн через веб-интерфейс и мобильное приложение. 
                  После оформления подписки вы получаете немедленный доступ к выбранному плану.
                </p>
                <div>
                  <h3 className="font-medium mb-2">Процесс активации услуг:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Регистрация на платформе EVERLIV</li>
                    <li>Выбор подходящего тарифного плана</li>
                    <li>Оплата подписки через безопасный платежный шлюз</li>
                    <li>Мгновенный доступ ко всем функциям выбранного плана</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Сроки предоставления</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-evergreen-100 text-evergreen-600 flex items-center justify-center flex-shrink-0 font-semibold">1</div>
                    <div>
                      <p className="font-medium">Базовые анализы и отчеты</p>
                      <p className="text-sm text-gray-500">Доступны мгновенно после обработки данных</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-evergreen-100 text-evergreen-600 flex items-center justify-center flex-shrink-0 font-semibold">2</div>
                    <div>
                      <p className="font-medium">AI-анализ данных</p>
                      <p className="text-sm text-gray-500">Обработка занимает до 1 часа в зависимости от объема</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-evergreen-100 text-evergreen-600 flex items-center justify-center flex-shrink-0 font-semibold">3</div>
                    <div>
                      <p className="font-medium">Персонализированные рекомендации</p>
                      <p className="text-sm text-gray-500">Формируются в течение 24 часов после загрузки всех данных</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-evergreen-100 text-evergreen-600 flex items-center justify-center flex-shrink-0 font-semibold">4</div>
                    <div>
                      <p className="font-medium">Консультации специалистов</p>
                      <p className="text-sm text-gray-500">Назначаются в течение 48 часов (только для премиум-подписки)</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-everliv-600 mr-3" />
                  <h2 className="text-xl font-semibold">Гарантии качества</h2>
                </div>
                <div className="space-y-3">
                  <p>
                    Мы гарантируем высокое качество предоставляемых услуг и соблюдение всех заявленных сроков.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-evergreen-500 font-bold">✓</span>
                      <span>Возврат средств при невозможности оказания услуг</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-evergreen-500 font-bold">✓</span>
                      <span>Соответствие рекомендаций современным научным данным</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-evergreen-500 font-bold">✓</span>
                      <span>Защита и конфиденциальность ваших данных</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-evergreen-500 font-bold">✓</span>
                      <span>Техническая поддержка в течение всего срока подписки</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Техническая поддержка</h2>
              <div className="space-y-3">
                <p>
                  Наша служба поддержки работает для вас каждый день с 9:00 до 21:00 (МСК).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Способы связи с поддержкой:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>Email: support@everliv.ai</li>
                      <li>Телефон: +7 (495) 123-45-67</li>
                      <li>Чат на сайте (для авторизованных пользователей)</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Время ответа:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>Базовый тариф: до 24 часов</li>
                      <li>Стандартный тариф: до 12 часов</li>
                      <li>Премиум тариф: до 3 часов</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryInfo;
