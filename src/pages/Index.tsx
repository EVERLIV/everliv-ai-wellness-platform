
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import KeyFeaturesSection from '@/components/KeyFeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import HealthPathSection from '@/components/HealthPathSection';
import FeaturesGridSection from '@/components/FeaturesGridSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import PartnershipSection from '@/components/PartnershipSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-16">
        <HeroSection />
        <KeyFeaturesSection />
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

export default Index;
