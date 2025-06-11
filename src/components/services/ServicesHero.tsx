
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ServicesHero = () => {
  return (
    <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ваше здоровье под полным контролем
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Четыре мощных инструмента для комплексного мониторинга, анализа и улучшения вашего здоровья с использованием передовых технологий искусственного интеллекта
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/pricing">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Выбрать тариф
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-green-400 hover:bg-white hover:text-primary">
                Попробовать бесплатно
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
