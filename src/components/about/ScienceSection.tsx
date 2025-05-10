
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const ScienceSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Наш научный подход</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Биологические маркеры</h3>
                <p className="text-gray-700 mb-4">
                  Мы используем комплексный анализ биомаркеров крови для создания полной картины вашего здоровья. Это включает:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Маркеры воспаления (СРБ, ИЛ-6, ФНО-α)</li>
                  <li>Гормональный баланс (тестостерон, эстрадиол, кортизол)</li>
                  <li>Метаболические показатели (глюкоза, инсулин, HbA1c)</li>
                  <li>Липидный профиль и маркеры сердечно-сосудистого риска</li>
                  <li>Показатели иммунной функции и окислительного стресса</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Персонализированный подход</h3>
                <p className="text-gray-700 mb-4">
                  Наша система искусственного интеллекта анализирует ваши индивидуальные особенности, генетику, 
                  образ жизни и результаты анализов для создания максимально эффективных рекомендаций именно для вас.
                </p>
                <p className="text-gray-700">
                  Мы постоянно обновляем наши алгоритмы на основе новейших научных исследований и 
                  данных наших пользователей для достижения наилучших результатов.
                </p>
                <div className="mt-4">
                  <img 
                    src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80" 
                    alt="Персонализированный подход"
                    className="rounded-md w-full h-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                  alt="Научный анализ данных"
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-everliv-800">Научная обоснованность</h2>
              <p className="text-lg mb-6 text-gray-600">
                Все рекомендации EVERLIV основаны на обширных научных исследованиях и современных медицинских протоколах. Мы сотрудничаем с ведущими научными институтами для постоянного совершенствования наших алгоритмов.
              </p>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-evergreen-500 rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">Регулярные обновления на основе новейших исследований</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-evergreen-500 rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">Верификация рекомендаций медицинскими экспертами</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-evergreen-500 rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">Прозрачность алгоритмов и источников данных</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScienceSection;
