
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AboutHero = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-secondary via-primary to-primary/90 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading">О платформе EVERLIV</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            EVERLIV — это революционная платформа, использующая искусственный интеллект для создания персонализированных рекомендаций по здоровью и долголетию на основе ваших индивидуальных данных.
          </p>
          <Button className="bg-white text-secondary hover:bg-gray-50" size="lg">
            Узнать больше о технологии
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
