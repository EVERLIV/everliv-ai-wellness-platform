
import React from 'react';
import HeroSection from '@/components/HeroSection';
import KeyFeaturesSection from '@/components/KeyFeaturesSection';
import ServicesSection from '@/components/ServicesSection';
import DataProtectionSection from '@/components/DataProtectionSection';
import ScientificBasisSection from '@/components/ScientificBasisSection';
import AiMedicineSection from '@/components/AiMedicineSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import HealthPathSection from '@/components/HealthPathSection';
import FeaturesGridSection from '@/components/FeaturesGridSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PartnershipSection from '@/components/PartnershipSection';
import CTASection from '@/components/CTASection';
import CompanyInfoSection from '@/components/CompanyInfoSection';
import MinimalFooter from '@/components/MinimalFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <HeroSection />
        <KeyFeaturesSection />
        <ServicesSection />
        <DataProtectionSection />
        <ScientificBasisSection />
        <AiMedicineSection />
        <HowItWorksSection />
        <HealthPathSection />
        <FeaturesGridSection />
        <TestimonialsSection />
        <PartnershipSection />
        <CompanyInfoSection />
        <CTASection />
      </main>
      <MinimalFooter />
    </div>
  );
};

export default LandingPage;
