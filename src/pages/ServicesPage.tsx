
import React from 'react';
import ServicesSection from '@/components/ServicesSection';
import PageLayout from '@/components/PageLayout';

const ServicesPage = () => {
  return (
    <PageLayout 
      title="Наши сервисы"
      description="Мы предлагаем широкий спектр услуг, основанных на научном подходе к здоровью и долголетию"
      breadcrumbItems={[{ title: "Сервисы" }]}
    >
      <ServicesSection />
    </PageLayout>
  );
};

export default ServicesPage;
