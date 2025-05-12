
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TeamSection from "@/components/about/TeamSection";
import MissionSection from "@/components/about/MissionSection";
import ScienceSection from "@/components/about/ScienceSection";
import TechnologySection from "@/components/about/TechnologySection";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="О компании EVERLIV"
          description="Мы объединяем передовую науку, современные технологии и персонализированный подход для поддержания здоровья и долголетия"
        />
        <MissionSection />
        <TeamSection />
        <ScienceSection />
        <TechnologySection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
