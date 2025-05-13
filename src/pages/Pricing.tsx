
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PricingTable from "@/components/pricing/PricingTable";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import CorporatePricing from "@/components/pricing/CorporatePricing";
import CTASection from "@/components/CTASection";
import PricingFeaturesTable from "@/components/pricing/PricingFeaturesTable";
import PageLayout from "@/components/PageLayout";

const Pricing = () => {
  return (
    <PageLayout
      title="Тарифы и цены"
      description="Выберите тариф, который подходит именно вам, и начните заботиться о своем здоровье уже сегодня"
    >
      <PricingTable />
      <PricingFeaturesTable />
      <CorporatePricing />
      <PricingFAQ />
      <CTASection />
    </PageLayout>
  );
};

export default Pricing;
