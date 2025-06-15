
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PricingHero = () => {
  const { user } = useAuth();

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Тарифные планы Everliv</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Выберите план, который подходит именно вам для заботы о вашем здоровье и благополучии
        </p>
      </div>
    </section>
  );
};

export default PricingHero;
