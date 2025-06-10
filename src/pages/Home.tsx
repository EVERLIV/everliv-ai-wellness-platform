
import React from 'react';
import HomeHeader from '@/components/home/HomeHeader';
import HeroSection from '@/components/HeroSection';
import KeyFeaturesSection from '@/components/KeyFeaturesSection';
import TrialChat from '@/components/home/TrialChat';
import ServicesSection from '@/components/ServicesSection';
import DataProtectionSection from '@/components/DataProtectionSection';
import ScientificBasisSection from '@/components/ScientificBasisSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PartnershipSection from '@/components/PartnershipSection';
import CTASection from '@/components/CTASection';
import HomeFooter from '@/components/home/HomeFooter';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HomeHeader />
      <main className="flex-grow pt-16">
        <HeroSection />
        <KeyFeaturesSection />
        <TrialChat />
        <ServicesSection />
        <DataProtectionSection />
        <ScientificBasisSection />
        <PricingSection />
        <TestimonialsSection />
        <PartnershipSection />
        <CTASection />
      </main>
      <HomeFooter />
    </div>
  );
};

export default Home;
