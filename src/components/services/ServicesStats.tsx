
import React from 'react';

const ServicesStats = () => {
  const stats = [
    { number: '50,000+', label: 'Проанализированных анализов' },
    { number: '15,000+', label: 'Активных пользователей' },
    { number: '98%', label: 'Точность ИИ-анализа' },
    { number: '24/7', label: 'Доступность сервисов' }
  ];

  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesStats;
