
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorksSection = () => {
  const steps = [
    {
      step: '1',
      title: 'Регистрация',
      description: 'Создайте аккаунт и выберите подходящий тариф'
    },
    {
      step: '2',
      title: 'Загрузка данных',
      description: 'Добавьте результаты анализов и данные о здоровье'
    },
    {
      step: '3',
      title: 'ИИ-анализ',
      description: 'Получите детальный анализ и персональные рекомендации'
    },
    {
      step: '4',
      title: 'Мониторинг',
      description: 'Отслеживайте прогресс и корректируйте стратегию'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Простой процесс в 4 шага для полного контроля над вашим здоровьем
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
