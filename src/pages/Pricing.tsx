
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingHero from "@/components/pricing/PricingHero";
import PricingTable from "@/components/pricing/PricingTable";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import CorporatePricing from "@/components/pricing/CorporatePricing";
import CTASection from "@/components/CTASection";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <PricingHero />
        <PricingTable />
        <CorporatePricing />
        <PricingFAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
