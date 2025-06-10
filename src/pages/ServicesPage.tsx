
import React from 'react';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesGrid from '@/components/services/ServicesGrid';
import HowItWorksSection from '@/components/services/HowItWorksSection';
import ServicesStats from '@/components/services/ServicesStats';
import ServicesCTA from '@/components/services/ServicesCTA';

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <ServicesHero />
        <ServicesGrid />
        <HowItWorksSection />
        <ServicesStats />
        <ServicesCTA />
      </main>
      <MinimalFooter />
    </div>
  );
};

export default ServicesPage;
