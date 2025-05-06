
import { Button } from "@/components/ui/button";

const MissionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-everliv-700 via-everliv-800 to-everliv-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Наша миссия</h2>
          <p className="text-xl mb-8">
            Мы создаем будущее, где каждый человек имеет доступ к персонализированным рекомендациям по здоровью, основанным на научных данных и современных технологиях.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-everliv-800 hover:bg-gray-100" size="lg">
              Присоединиться к миссии
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
              Узнать больше
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-evergreen-400 mb-2">500,000+</div>
              <p className="text-white/80">Пользователей на платформе</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-evergreen-400 mb-2">98%</div>
              <p className="text-white/80">Отмечают улучшение самочувствия</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-evergreen-400 mb-2">15+</div>
              <p className="text-white/80">Лет исследований в основе</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
