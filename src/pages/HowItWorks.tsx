
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Как это работает</h1>
              <p className="text-lg text-gray-600 mb-8">
                Подробная информация о принципах работы платформы EVERLIV будет доступна скоро.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
