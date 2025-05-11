
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Наши сервисы</h1>
          <p className="text-lg text-gray-700 mb-12">
            Мы предлагаем широкий спектр услуг, основанных на научном подходе к здоровью и долголетию
          </p>
        </div>
        <ServicesSection />
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;
