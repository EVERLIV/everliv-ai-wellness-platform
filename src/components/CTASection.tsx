
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="hero-gradient py-16 md:py-20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-evergreen-500 opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-everliv-400 opacity-10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Начните свой путь к оптимальному здоровью и долголетию сегодня
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам людей, которые уже используют EVERLIV для достижения своих целей в области здоровья.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/signup">
              <Button className="bg-white text-everliv-800 hover:bg-gray-100 font-medium px-8 py-6 text-lg">
                Начать бесплатно
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium px-8 py-6 text-lg">
                Связаться с нами
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
