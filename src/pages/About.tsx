
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import TeamSection from "@/components/about/TeamSection";
import TechnologySection from "@/components/about/TechnologySection";
import MissionSection from "@/components/about/MissionSection";
import ScienceSection from "@/components/about/ScienceSection";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <AboutHero />
        <TechnologySection />
        <ScienceSection />
        <TeamSection />
        <MissionSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
