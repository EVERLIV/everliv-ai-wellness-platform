
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ServicesCTA = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Начните контролировать свое здоровье уже сегодня</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Присоединитесь к тысячам пользователей, которые уже улучшили свое здоровье с помощью наших сервисов
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to={user ? "/dashboard" : "/signup"}>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {user ? 'Перейти в панель' : 'Начать бесплатно'}
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="outline">
              Посмотреть тарифы
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesCTA;
