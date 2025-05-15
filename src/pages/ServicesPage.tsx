
import React from 'react';
import PageLayout from '@/components/PageLayout';
import ServicesSection from '@/components/ServicesSection';
import AiMedicineSection from '@/components/AiMedicineSection';
import CTASection from '@/components/CTASection';

const ServicesPage = () => {
  return (
    <PageLayout 
      title="Наши сервисы"
      description="Мы предлагаем широкий спектр услуг, основанных на научном подходе к здоровью и долголетию"
      breadcrumbItems={[{ title: "Сервисы" }]}
      fullWidth={true}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-evergreen-500 to-evergreen-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Научный подход к здоровью и долголетию</h1>
            <p className="text-xl mb-8 opacity-90">
              Наши сервисы основаны на передовых научных исследованиях и позволяют оптимизировать здоровье на клеточном уровне
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#blood-analysis" className="bg-white text-evergreen-700 px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all">
                Анализ крови с AI
              </a>
              <a href="/services/personalized-supplements" className="bg-opacity-20 bg-white text-white border border-white px-6 py-3 rounded-full font-medium hover:bg-opacity-30 transition-all">
                Подробнее о сервисах
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <ServicesSection />

      {/* Blood Analysis Highlight Section */}
      <section id="blood-analysis" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-evergreen-700">Анализ крови с искусственным интеллектом</h2>
              <p className="text-gray-700 mb-6">
                Наш AI анализирует результаты ваших анализов крови, выявляет отклонения от нормы и предлагает персонализированные 
                рекомендации по оптимизации показателей. Загрузите фото вашего анализа или введите результаты вручную.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-evergreen-500 mr-2">•</span>
                  <span>Детальный разбор каждого показателя</span>
                </li>
                <li className="flex items-start">
                  <span className="text-evergreen-500 mr-2">•</span>
                  <span>Сравнение с оптимальными значениями</span>
                </li>
                <li className="flex items-start">
                  <span className="text-evergreen-500 mr-2">•</span>
                  <span>Рекомендации по питанию и добавкам</span>
                </li>
                <li className="flex items-start">
                  <span className="text-evergreen-500 mr-2">•</span>
                  <span>Отслеживание динамики показателей</span>
                </li>
              </ul>
              <a href="/blood-analysis" className="inline-flex items-center bg-evergreen-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-evergreen-600 transition-colors">
                Попробовать анализ
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80" 
                alt="Анализ крови с AI" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Medicine Section */}
      <AiMedicineSection />

      {/* CTA Section */}
      <CTASection />
    </PageLayout>
  );
};

export default ServicesPage;
