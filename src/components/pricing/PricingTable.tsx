
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PricingTable = () => {
  const [annual, setAnnual] = useState(true);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Toggle Annual/Monthly */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Годовая оплата <span className="text-evergreen-500 text-xs ml-1">(Скидка 20%)</span>
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${annual ? 'bg-everliv-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  annual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${!annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Ежемесячно
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-everliv-800 mb-2">Базовый</h3>
                <p className="text-gray-600 mb-6">Для начинающих следить за здоровьем</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{annual ? '790' : '990'}</span>
                  <span className="text-gray-600"> руб./мес</span>
                  {annual && <p className="text-sm text-gray-500">при годовой оплате</p>}
                </div>
                <Link to="/signup">
                  <Button variant="outline" className="w-full border-everliv-600 text-everliv-600 hover:bg-everliv-50">
                    Начать бесплатно
                  </Button>
                </Link>
              </div>
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Базовый анализ здоровья</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Интерпретация до 5 показателей</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Еженедельные отчеты</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <CheckCircle className="h-5 w-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                    <span>Персонализированные планы питания</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Standard Plan */}
            <div className="border-2 border-everliv-600 rounded-xl shadow-md overflow-hidden bg-white relative">
              <div className="bg-everliv-600 text-white text-xs font-semibold px-3 py-1 absolute right-0 top-0 rounded-bl">
                Популярный выбор
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-everliv-800 mb-2">Стандарт</h3>
                <p className="text-gray-600 mb-6">Для активной заботы о здоровье</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{annual ? '1490' : '1790'}</span>
                  <span className="text-gray-600"> руб./мес</span>
                  {annual && <p className="text-sm text-gray-500">при годовой оплате</p>}
                </div>
                <Link to="/signup">
                  <Button className="w-full bg-everliv-600 hover:bg-everliv-700 text-white">
                    Выбрать план
                  </Button>
                </Link>
              </div>
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Расширенный анализ здоровья</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Интерпретация до 15 показателей</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Персонализированные планы питания</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Рекомендации по добавкам</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-everliv-800 mb-2">Премиум</h3>
                <p className="text-gray-600 mb-6">Максимальные возможности</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{annual ? '1990' : '2490'}</span>
                  <span className="text-gray-600"> руб./мес</span>
                  {annual && <p className="text-sm text-gray-500">при годовой оплате</p>}
                </div>
                <Link to="/signup">
                  <Button variant="outline" className="w-full border-everliv-600 text-everliv-600 hover:bg-everliv-50">
                    Выбрать план
                  </Button>
                </Link>
              </div>
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Полный анализ здоровья</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Интерпретация всех показателей</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">VIP поддержка от экспертов</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-evergreen-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Квартальные консультации</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
