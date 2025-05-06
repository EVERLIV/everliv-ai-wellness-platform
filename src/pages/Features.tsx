
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturesHero from "@/components/features/FeaturesHero";
import FeaturesList from "@/components/features/FeaturesList";
import DemoSection from "@/components/features/DemoSection";
import TechnologyShowcase from "@/components/features/TechnologyShowcase";

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <FeaturesHero />
        <FeaturesList />
        <DemoSection />
        <TechnologyShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Features;
