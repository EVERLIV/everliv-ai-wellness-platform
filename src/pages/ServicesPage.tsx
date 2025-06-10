
import React from 'react';
import PageLayout from '@/components/PageLayout';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesGrid from '@/components/services/ServicesGrid';
import HowItWorksSection from '@/components/services/HowItWorksSection';
import ServicesStats from '@/components/services/ServicesStats';
import ServicesCTA from '@/components/services/ServicesCTA';

const ServicesPage = () => {
  return (
    <PageLayout 
      title="Наши сервисы"
      description="Комплексная экосистема для мониторинга и улучшения здоровья"
      breadcrumbItems={[{ title: "Сервисы" }]}
      fullWidth={true}
    >
      <ServicesHero />
      <ServicesGrid />
      <HowItWorksSection />
      <ServicesStats />
      <ServicesCTA />
    </PageLayout>
  );
};

export default ServicesPage;
