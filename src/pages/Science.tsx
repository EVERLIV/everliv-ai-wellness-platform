
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ScientificMethods from "@/components/science/ScientificMethods";
import ExpertCollaboration from "@/components/science/ExpertCollaboration";
import ScienceHero from "@/components/science/ScienceHero";

const Science = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="Научный подход EVERLIV"
          description="Узнайте о научной базе и исследованиях, которые лежат в основе наших технологий и рекомендаций"
        />
        <ScientificMethods />
        <ExpertCollaboration />
      </main>
      <Footer />
    </div>
  );
};

export default Science;
