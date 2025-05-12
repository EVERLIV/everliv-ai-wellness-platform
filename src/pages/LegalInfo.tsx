
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const LegalInfo = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">Юридическая информация</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Сведения о компании</h2>
              <div className="space-y-2">
                <p><strong>Полное наименование организации:</strong> Общество с ограниченной ответственностью "КЕЙ ДЖИ ИНЖИНИРИНГ»</p>
                <p><strong>Сокращенное наименование организации:</strong> ООО «КЕЙ ДЖИ ИНЖИНИРИНГ»</p>
                <p><strong>Юридический адрес:</strong> 107045, г. Москва, Даев переулок, дом 20, пом.52Г</p>
                <p><strong>ОГРН:</strong> 1177746965131</p>
                <p><strong>ИНН:</strong> 7702423360</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Условия оказания услуг</h2>
              <div className="space-y-4">
                <section>
                  <h3 className="text-lg font-medium mb-2">1. Общие положения</h3>
                  <p className="text-gray-700">
                    1.1. Настоящие Условия регулируют взаимоотношения между ООО «КЕЙ ДЖИ ИНЖИНИРИНГ» (далее — «Компания») и пользователем (далее — «Пользователь») платформы EVERLIV (далее — «Платформа»).
                  </p>
                  <p className="text-gray-700">
                    1.2. Используя Платформу, Пользователь подтверждает, что полностью принимает все условия данного соглашения.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-medium mb-2">2. Условия подписки</h3>
                  <p className="text-gray-700">
                    2.1. Платформа предоставляет доступ к сервисам на основе подписки. Доступны следующие тарифы: Базовый, Стандарт и Премиум.
                  </p>
                  <p className="text-gray-700">
                    2.2. Пользователь имеет право на бесплатный пробный период длительностью 24 часа с момента регистрации.
                  </p>
                  <p className="text-gray-700">
                    2.3. По окончании пробного периода доступ к функциям платформы будет ограничен до момента оформления подписки.
                  </p>
                  <p className="text-gray-700">
                    2.4. Подписка автоматически продлевается в конце расчетного периода, если Пользователь не отменил её.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-medium mb-2">3. Оплата услуг</h3>
                  <p className="text-gray-700">
                    3.1. Оплата услуг осуществляется с помощью банковских карт или через Систему быстрых платежей (СБП).
                  </p>
                  <p className="text-gray-700">
                    3.2. Все платежи обрабатываются через защищенные платежные системы.
                  </p>
                  <p className="text-gray-700">
                    3.3. Компания не хранит полные данные банковских карт пользователей.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-medium mb-2">4. Отказ от ответственности</h3>
                  <p className="text-gray-700">
                    4.1. Информация, предоставляемая через Платформу, не заменяет профессиональную медицинскую консультацию. Всегда консультируйтесь с квалифицированным медицинским работником по вопросам здоровья.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Гарантийные условия</h2>
              <p className="mb-4">
                Мы стремимся предоставить нашим пользователям высококачественные услуги и гарантируем следующее:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Доступность платформы не менее 99.5% времени</li>
                <li>Своевременное обновление научной базы знаний</li>
                <li>Защита персональных данных в соответствии с законодательством РФ</li>
                <li>Возможность отмены подписки в любой момент</li>
                <li>Возврат средств в случае невозможности оказания услуг по вине Компании</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalInfo;
