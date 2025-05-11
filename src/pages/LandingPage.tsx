
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-24"> {/* Increased padding-top to prevent overlap with header */}
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
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
