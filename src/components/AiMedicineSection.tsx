
import React from 'react';
import { Brain, Zap, BarChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AiMedicineSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Сила ИИ в медицине</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Используя искусственный интеллект, мы революционизируем подход к персонализированной медицине
            и помогаем предотвращать болезни еще до их появления
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Персонализированный анализ</h3>
            <p className="text-gray-600 text-sm">
              Наш ИИ анализирует тысячи показателей для создания индивидуального плана здоровья
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Раннее выявление рисков</h3>
            <p className="text-gray-600 text-sm">
              Алгоритмы определяют потенциальные риски здоровья на основе минимальных изменений показателей
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <BarChart className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Прогнозирование здоровья</h3>
            <p className="text-gray-600 text-sm">
              Предсказание динамики показателей здоровья при следовании рекомендациям
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Коллективная мудрость</h3>
            <p className="text-gray-600 text-sm">
              Анализ результатов сотен тысяч пользователей для оптимизации рекомендаций
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80" 
                alt="AI в медицине" 
                className="rounded-lg w-full h-auto object-cover"
                style={{ maxHeight: '200px' }} 
              />
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold mb-2">Применение ИИ в персонализированной медицине</h3>
              <p className="text-gray-600 mb-4">
                Наш ИИ постоянно обучается и совершенствуется, использует данные из тысяч научных исследований и клинических 
                случаев, чтобы предлагать максимально точные и эффективные рекомендации для вашего здоровья.
              </p>
              <Link to="/ai-medecine">
                <Button className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white">
                  Подробнее о технологии
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiMedicineSection;
