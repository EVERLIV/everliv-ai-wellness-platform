
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Clock } from "lucide-react";

const PricingHero = () => {
  const { user } = useAuth();

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
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-everliv-600" />
                Пробный период 1 день
              </h3>
              <p className="text-gray-600">
                Исследуйте все функции платформы бесплатно в течение 24 часов после регистрации
              </p>
              <p className="text-sm text-gray-500 mt-2">
                По истечении пробного периода доступ будет ограничен до приобретения подписки
              </p>
            </div>
            {!user ? (
              <Link to="/signup">
                <Button variant="outline" className="whitespace-nowrap bg-everliv-600 text-white hover:bg-everliv-700 border-none">
                  Начать бесплатно
                </Button>
              </Link>
            ) : (
              <Link to="/subscription">
                <Button variant="outline" className="whitespace-nowrap">
                  Управление подпиской
                </Button>
              </Link>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Не требуется кредитная карта. Полный доступ ко всем функциям в течение 24 часов.
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingHero;
