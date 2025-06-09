
import Header from "@/components/Header";
import PageHeader from "@/components/PageHeader";
import FeaturesList from "@/components/features/FeaturesList";
import DemoSection from "@/components/features/DemoSection";
import TechnologyShowcase from "@/components/features/TechnologyShowcase";

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="Возможности платформы"
          description="Познакомьтесь с передовыми функциями и технологиями, которые делают EVERLIV уникальной платформой для здоровья и долголетия"
        />
        <FeaturesList />
        <DemoSection />
        <TechnologyShowcase />
      </main>
    </div>
  );
};

export default Features;
