
import Header from "@/components/Header";
import PageHeader from "@/components/PageHeader";
import FAQAccordion from "@/components/faq/FAQAccordion";
import ContactCTA from "@/components/faq/ContactCTA";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="Часто задаваемые вопросы"
          description="Ответы на самые распространенные вопросы о наших услугах и технологиях"
        />
        <FAQAccordion />
        <ContactCTA />
      </main>
    </div>
  );
};

export default FAQ;
