
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const DetailedServiceInfo = () => {
  const services = [
    {
      name: "Комплексный AI-анализ",
      description: "Полный анализ вашего здоровья с использованием искусственного интеллекта.",
      features: [
        "Подробная интерпретация медицинских анализов",
        "Выявление скрытых факторов риска",
        "Персонализированные рекомендации на основе AI-моделей",
        "Отслеживание динамики показателей во времени"
      ],
      price: "Включено в Стандарт и Премиум тариф",
      guarantee: "Гарантия точности 98%, подтвержденная клиническими испытаниями"
    },
    {
      name: "Анализ биологического возраста",
      description: "Определение вашего биологического возраста и факторов, влияющих на процессы старения.",
      features: [
        "Расчет биологического возраста по 14 параметрам",
        "Сравнение с нормами для вашей возрастной группы",
        "Выявление ключевых факторов ускоренного старения",
        "Рекомендации по замедлению процессов старения"
      ],
      price: "Включено в Премиум тариф, доступно как дополнительная услуга в Стандарт тарифе",
      guarantee: "Методология подтверждена научными исследованиями и публикациями"
    },
    {
      name: "Персонализированные протоколы",
      description: "Индивидуальные протоколы для улучшения здоровья, составленные с учетом ваших особенностей.",
      features: [
        "Полностью персонализированные рекомендации",
        "Протоколы питания с учетом ваших предпочтений",
        "Программа физической активности оптимальной для вас",
        "Рекомендации по добавкам и витаминам"
      ],
      price: "Включено во все тарифы с разным уровнем персонализации",
      guarantee: "Возможность корректировки протоколов в течение 30 дней после получения"
    },
    {
      name: "Консультации специалистов",
      description: "Онлайн-консультации с врачами и экспертами по вопросам здоровья и долголетия.",
      features: [
        "Консультации с сертифицированными специалистами",
        "Интерпретация результатов анализов",
        "Ответы на вопросы по протоколам и рекомендациям",
        "Обсуждение индивидуальной стратегии оздоровления"
      ],
      price: "Включено только в Премиум тариф (1 консультация в месяц)",
      guarantee: "Гарантированное время ответа в течение 48 часов"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Подробное описание услуг</h2>
        <div className="space-y-6">
          {services.map((service, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Включает:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex gap-2">
                          <CheckCircle className="h-5 w-5 text-evergreen-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-1">Стоимость:</h4>
                      <p>{service.price}</p>
                    </div>
                    <div className="bg-evergreen-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-1">Гарантия:</h4>
                      <p className="text-sm">{service.guarantee}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedServiceInfo;
