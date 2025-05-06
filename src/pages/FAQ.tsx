
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQHero from "@/components/faq/FAQHero";
import FAQAccordion from "@/components/faq/FAQAccordion";
import ContactCTA from "@/components/faq/ContactCTA";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <FAQHero />
        <FAQAccordion />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
