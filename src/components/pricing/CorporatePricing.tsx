
import { Button } from "@/components/ui/button";

const CorporatePricing = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-everliv-700 to-everliv-800 text-white p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Корпоративные решения</h3>
              <p className="mb-6">
                Забота о здоровье сотрудников — инвестиция в эффективность вашей компании. Предложите своей команде доступ к передовым технологиям персонализированного здравоохранения.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Персональные кабинеты для каждого сотрудника
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Административный портал для HR-отдела
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Аналитика здоровья на уровне компании
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h4 className="text-xl font-semibold mb-4 text-everliv-800">Персональное предложение для вашей компании</h4>
              <p className="text-gray-600 mb-6">
                Свяжитесь с нами, чтобы получить индивидуальное коммерческое предложение с учетом размера вашей компании и специфики бизнеса.
              </p>
              <div className="flex flex-col space-y-4">
                <Button className="bg-everliv-600 hover:bg-everliv-700 text-white w-full">
                  Запросить коммерческое предложение
                </Button>
                <Button variant="outline" className="border-everliv-600 text-everliv-600 hover:bg-everliv-50 w-full">
                  Связаться с отделом продаж
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporatePricing;
