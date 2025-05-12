
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';
import PageHeader from '@/components/PageHeader';

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="Наши сервисы"
          description="Мы предлагаем широкий спектр услуг, основанных на научном подходе к здоровью и долголетию"
        />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
