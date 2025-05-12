
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Database, Server, FileCheck, Eye } from 'lucide-react';

const Security = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 bg-white">
        <section className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Безопасность данных</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Мы применяем передовые технологии и протоколы для защиты ваших данных на каждом этапе их использования
            </p>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Основные принципы защиты данных</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Shield className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Многоуровневая защита</h3>
                      <p className="text-gray-700">
                        Мы используем несколько механизмов защиты одновременно, не полагаясь на единственный метод шифрования для обеспечения максимальной безопасности.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Database className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Шифрование в состоянии покоя</h3>
                      <p className="text-gray-700">
                        Все хранимые данные зашифрованы стандартом AES-256, когда они не используются, что делает их недоступными для посторонних.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Lock className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Шифрование при передаче</h3>
                      <p className="text-gray-700">
                        Данные шифруются во время любой передачи между компонентами системы с использованием протоколов TLS/SSL последних версий.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <FileCheck className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Шифрование при использовании</h3>
                      <p className="text-gray-700">
                        По возможности мы работаем с зашифрованными данными даже в процессе обработки, используя гомоморфное шифрование для аналитики.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Как мы защищаем ваши данные</h2>
                
                <div className="bg-gray-100 rounded-lg p-8 mb-8">
                  <div className="flex items-start mb-6">
                    <Server className="h-7 w-7 text-primary flex-shrink-0 mr-4 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Безопасная инфраструктура</h3>
                      <p className="text-gray-700">
                        Наша платформа размещена в сертифицированных дата-центрах с физической защитой и круглосуточным мониторингом. Мы используем облачную инфраструктуру мирового класса, соответствующую стандартам ISO 27001, SOC 2 Type II и GDPR.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-6">
                    <Shield className="h-7 w-7 text-primary flex-shrink-0 mr-4 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Регулярные аудиты безопасности</h3>
                      <p className="text-gray-700">
                        Мы проводим регулярные внутренние и внешние аудиты безопасности, включая тестирование на проникновение и сканирование уязвимостей. Наши системы постоянно обновляются для защиты от новых угроз.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Eye className="h-7 w-7 text-primary flex-shrink-0 mr-4 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Контроль доступа</h3>
                      <p className="text-gray-700">
                        Мы применяем строгие политики контроля доступа, основанные на принципе наименьших привилегий. Каждый доступ к данным логируется и отслеживается. Сотрудники имеют доступ только к тем данным, которые необходимы для выполнения их обязанностей.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Техническая инфографика: Процесс шифрования данных</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                          <span className="text-primary font-bold">1</span>
                        </div>
                        <h4 className="font-semibold mb-2">Ввод данных</h4>
                        <p className="text-sm text-gray-600">Данные поступают в систему через защищенное TLS-соединение</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                          <span className="text-primary font-bold">2</span>
                        </div>
                        <h4 className="font-semibold mb-2">Шифрование</h4>
                        <p className="text-sm text-gray-600">Применяется многоуровневое шифрование с использованием алгоритма AES-256</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                          <span className="text-primary font-bold">3</span>
                        </div>
                        <h4 className="font-semibold mb-2">Хранение</h4>
                        <p className="text-sm text-gray-600">Зашифрованные данные размещаются в географически распределенных дата-центрах</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                          <span className="text-primary font-bold">4</span>
                        </div>
                        <h4 className="font-semibold mb-2">Обработка</h4>
                        <p className="text-sm text-gray-600">Обработка данных происходит в защищенной среде с применением гомоморфного шифрования</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                          <span className="text-primary font-bold">5</span>
                        </div>
                        <h4 className="font-semibold mb-2">Аутентификация</h4>
                        <p className="text-sm text-gray-600">Многофакторная аутентификация для доступа к данным</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                          <span className="text-primary font-bold">6</span>
                        </div>
                        <h4 className="font-semibold mb-2">Доставка</h4>
                        <p className="text-sm text-gray-600">Данные доставляются пользователю по защищенному каналу с временным ключом</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Соответствие стандартам и сертификации</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-3">Международные стандарты</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>ISO 27001 (Информационная безопасность)</li>
                        <li>GDPR (Защита персональных данных)</li>
                        <li>HIPAA (Защита медицинской информации)</li>
                        <li>SOC 2 Type II (Безопасность, доступность и конфиденциальность)</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-3">Российские стандарты</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>ФЗ-152 "О персональных данных"</li>
                        <li>Приказ ФСТЭК России №21 (Защита информации)</li>
                        <li>Требования Роскомнадзора</li>
                        <li>Локализация хранения данных на территории РФ</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6">Ваш контроль над данными</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Мы верим, что ваши данные принадлежат вам. Вот почему мы предоставляем полный контроль над вашей информацией:
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 font-semibold text-sm">✓</span>
                    </div>
                    <p className="text-gray-700">
                      <strong>Прозрачность</strong>: Мы всегда сообщаем, какие данные собираем и как их используем
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 font-semibold text-sm">✓</span>
                    </div>
                    <p className="text-gray-700">
                      <strong>Доступ к данным</strong>: Вы всегда можете просмотреть все данные, которые мы храним о вас
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 font-semibold text-sm">✓</span>
                    </div>
                    <p className="text-gray-700">
                      <strong>Экспорт данных</strong>: Возможность выгрузить все ваши данные в стандартных форматах
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 font-semibold text-sm">✓</span>
                    </div>
                    <p className="text-gray-700">
                      <strong>Удаление данных</strong>: Вы можете запросить полное удаление всех ваших данных в любое время
                    </p>
                  </div>
                </div>
                
                <p className="text-lg text-gray-700">
                  Если у вас возникли вопросы о безопасности ваших данных или вам нужна дополнительная информация, 
                  пожалуйста, свяжитесь с нашей командой по адресу <a href="mailto:security@everliv.ai" className="text-primary underline">security@everliv.ai</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
