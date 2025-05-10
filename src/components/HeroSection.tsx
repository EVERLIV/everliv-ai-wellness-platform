
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
            Трансформируйте здоровье. 
            <span className="text-primary block mt-2">Побеждайте старение.</span> 
            <span className="block mt-2">Живите без ограничений.</span>
          </h1>
          <p className="text-md md:text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Отслеживайте прогресс. Обретайте энергию. Избавляйтесь от хронических болезней. 
            Присоединяйтесь к движению, сочетающему передовую науку, древнюю мудрость и ИИ-аналитику.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/signup">
              <Button size="lg" className="rounded-full bg-primary hover:bg-secondary text-white px-8">
                Начать бесплатную оценку здоровья
              </Button>
            </Link>
            <Link to="/blood-analysis">
              <Button size="lg" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white px-8">
                Узнайте свой биологический возраст
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-primary mb-1">100+</div>
              <div className="text-xs text-gray-500">Типов анализов</div>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-primary mb-1">25k+</div>
              <div className="text-xs text-gray-500">Пользователей платформы</div>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-xs text-gray-500">Персональная поддержка</div>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-primary mb-1">97%</div>
              <div className="text-xs text-gray-500">Точность диагностики</div>
            </div>
          </div>
          
          {/* Search Area */}
          <div className="relative max-w-lg mx-auto mb-8">
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm">
              <input 
                type="text"
                placeholder="Симптомы, заболевания или то, что вас беспокоит..."
                className="px-5 py-4 flex-grow text-sm outline-none"
              />
              <Button className="rounded-full bg-primary hover:bg-secondary h-12 w-12 flex items-center justify-center mr-1">
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
    </div>
  );
}
