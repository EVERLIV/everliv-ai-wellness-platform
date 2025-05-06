
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden hero-gradient">
      {/* Decorative Gradient Circle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-evergreen-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Оптимальное здоровье и долголетие на основе ИИ и науки
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            EVERLIV — персонализированная платформа здоровья, которая помогает достичь оптимального благополучия с помощью рекомендаций, основанных на доказательной медицине.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/signup">
              <Button className="bg-white text-everliv-800 hover:bg-gray-100 font-medium px-8 py-6 text-lg">
                Начать бесплатно
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium px-8 py-6 text-lg">
                Узнать больше
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 md:mt-16">
            <p className="text-sm text-white/70 mb-4">Нам доверяют медицинские эксперты из</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-80">
              <div className="text-white font-semibold text-lg">Центр Здоровья</div>
              <div className="text-white font-semibold text-lg">МедИнститут</div>
              <div className="text-white font-semibold text-lg">НаукаМед</div>
              <div className="text-white font-semibold text-lg">ВитаЛаб</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
