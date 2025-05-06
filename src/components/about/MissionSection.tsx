
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const MissionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-secondary via-primary to-primary/90 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Наша миссия</h2>
          <p className="text-xl mb-8">
            Мы создаем будущее, где каждый человек имеет доступ к персонализированным рекомендациям по здоровью, основанным на научных данных и современных технологиях.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-secondary hover:bg-gray-50" size="lg">
              Присоединиться к миссии
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
              Узнать больше
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2 font-heading">500,000+</div>
              <p className="text-white/90">Пользователей на платформе</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2 font-heading">98%</div>
              <p className="text-white/90">Отмечают улучшение самочувствия</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2 font-heading">15+</div>
              <p className="text-white/90">Лет исследований в основе</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
