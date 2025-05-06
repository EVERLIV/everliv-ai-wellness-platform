
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Search } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
            Ваше здоровье — наш приоритет
          </h1>
          <p className="text-md text-gray-600 mb-12 max-w-2xl mx-auto">
            EVERLIV разрабатывает новые методы диагностики через инновационные технологии искусственного интеллекта
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary mb-1">100+</div>
              <div className="text-xs text-gray-500">Типов анализов</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary mb-1">25k+</div>
              <div className="text-xs text-gray-500">Пользователей платформы</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-xs text-gray-500">Персональная поддержка</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary mb-1">97%</div>
              <div className="text-xs text-gray-500">Точность диагностики</div>
            </div>
          </div>
          
          {/* Search Box */}
          <div className="mb-4">
            <Link to="/signup" className="inline-block">
              <Button variant="outline" className="rounded-3xl font-medium text-gray-600 pl-6 border-gray-300">
                Узнать состояние здоровья
              </Button>
            </Link>
          </div>
          
          {/* Search Area */}
          <div className="relative max-w-lg mx-auto mb-8">
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
              <input 
                type="text"
                placeholder="Симптомы, заболевания или то, что вас беспокоит..."
                className="px-5 py-3 flex-grow text-sm outline-none"
              />
              <Button className="rounded-full bg-primary hover:bg-secondary h-10 w-10 flex items-center justify-center mr-1">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Проконсультируйтесь с AI-специалистом о вашем здоровье сейчас
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex justify-center">
              <img src="/lovable-uploads/1c7a38e9-8ae4-48ca-913e-142d38f7d302.png" alt="Decorative icon" className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
      
      {/* 100+ types section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="h-[1px] bg-gray-300 flex-grow"></div>
            <h2 className="text-lg text-gray-800 font-medium px-4">100 лет жизни</h2>
            <div className="h-[1px] bg-gray-300 flex-grow"></div>
          </div>
          <p className="text-sm text-gray-600 mb-8">
            Мы разрабатываем персональные подходы к оздоровлению на основе искусственного интеллекта и наукоёмких медицинских данных
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-700 mb-10">
            <p>
              Мы собираем массу данных о человеке (результаты лабораторных исследований и геномного анализа), определяем биологический возраст человека, выявляем текущие риски для здоровья и составляем персональный план оздоровления
            </p>
          </div>
          
          <Link to="/features" className="inline-block">
            <Button variant="outline" className="rounded-3xl text-sm border-primary text-primary hover:bg-primary hover:text-white">
              Узнать больше о платформе
            </Button>
          </Link>
          
          <div className="grid grid-cols-3 gap-8 mt-10 text-xs text-gray-600">
            <div className="flex items-start">
              <div className="h-4 w-4 rounded-full bg-gray-200 flex-shrink-0 mt-0.5 mr-2"></div>
              <p>Непрерывно отслеживаем показатели здоровья</p>
            </div>
            <div className="flex items-start">
              <div className="h-4 w-4 rounded-full bg-gray-200 flex-shrink-0 mt-0.5 mr-2"></div>
              <p>Выявляем ранние признаки заболеваний</p>
            </div>
            <div className="flex items-start">
              <div className="h-4 w-4 rounded-full bg-gray-200 flex-shrink-0 mt-0.5 mr-2"></div>
              <p>Прогнозируем риски хронических заболеваний</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
