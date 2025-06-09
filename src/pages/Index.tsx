
import KeyFeaturesSection from '@/components/KeyFeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import HealthPathSection from '@/components/HealthPathSection';
import FeaturesGridSection from '@/components/FeaturesGridSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import PartnershipSection from '@/components/PartnershipSection';
import ServicesSection from '@/components/ServicesSection';
import DataProtectionSection from '@/components/DataProtectionSection';
import ScientificBasisSection from '@/components/ScientificBasisSection';
import AiMedicineSection from '@/components/AiMedicineSection';
import CompanyInfoSection from '@/components/CompanyInfoSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
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
    </div>
  );
};

export default Index;
