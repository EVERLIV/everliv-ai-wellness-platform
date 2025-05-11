import React from "react";
const ScienceHero = () => {
  return <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-[16px] py-0 my-[50px]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Научная база EVERLIV</h1>
          <p className="text-lg text-gray-600 mb-8">
            Все методы и подходы EVERLIV основаны на научных исследованиях и проверенных практиках.
            Узнайте, как древняя мудрость и современная наука работают вместе для улучшения вашего здоровья.
          </p>
          <div className="mt-6">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" alt="Научные исследования" className="rounded-lg shadow-md mx-auto max-w-full h-auto object-cover" style={{
            maxHeight: "400px"
          }} />
          </div>
        </div>
      </div>
    </section>;
};
export default ScienceHero;