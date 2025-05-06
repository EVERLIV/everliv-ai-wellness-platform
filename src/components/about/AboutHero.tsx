
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AboutHero = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-heading text-gray-900">
            О платформе EVERLIV
          </h1>
          <p className="text-md text-gray-600 mb-8">
            EVERLIV — это революционная платформа, использующая искусственный интеллект для создания персонализированных рекомендаций по здоровью и долголетию на основе ваших индивидуальных данных.
          </p>
          <Button variant="outline" className="rounded-3xl border-primary text-primary hover:bg-primary hover:text-white" size="lg">
            Узнать больше о технологии
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
