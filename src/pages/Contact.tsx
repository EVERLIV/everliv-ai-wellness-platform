
import Header from "@/components/Header";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="Связаться с нами"
          description="У вас есть вопросы или предложения? Мы всегда рады помочь и выслушать ваше мнение"
        />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <ContactForm />
            </div>
            <div className="lg:w-1/2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
