
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import HealthPathSection from '@/components/HealthPathSection';
import FeaturesGridSection from '@/components/FeaturesGridSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-16">
        <HeroSection />
        <HowItWorksSection />
        <HealthPathSection />
        <FeaturesGridSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
