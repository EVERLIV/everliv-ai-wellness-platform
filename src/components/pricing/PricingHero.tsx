
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingHero = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Тарифные планы Everliv</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Выберите план, который подходит именно вам для заботы о вашем здоровье и благополучии
        </p>
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow-md mb-12 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-left">
              <h3 className="text-lg font-medium mb-2">Пробный период</h3>
              <p className="text-gray-600">
                Исследуйте основные функции платформы бесплатно, без необходимости подписки
              </p>
            </div>
            <Link to="/signup">
              <Button variant="outline" className="whitespace-nowrap">
                Начать бесплатно
              </Button>
            </Link>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Нет необходимости в кредитной карте. Попробуйте каждую функцию один раз без ограничений.
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingHero;
