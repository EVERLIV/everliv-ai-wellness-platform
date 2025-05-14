
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TeamSection from "@/components/about/TeamSection";
import MissionSection from "@/components/about/MissionSection";
import ScienceSection from "@/components/about/ScienceSection";
import TechnologySection from "@/components/about/TechnologySection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <PageHeader
          title="О компании EVERLIV"
          description="Мы объединяем передовую науку, современные технологии и персонализированный подход для поддержания здоровья и долголетия"
        />
        
        {/* CEO and Founder Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80&w=400" 
                  alt="Основатель компании" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4">Наша миссия</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Объединять людей и вести их к достижению цели — жить более 100 лет, сохраняя отличное здоровье и высокий энергетический ресурс. Мы обязуемся использовать для этого все последние и лучшие научные достижения ведущих мировых институтов, открытия Нобелевских лауреатов и передовую медицинскую практику, предоставляя наиболее полные и надежные рекомендации.
                </p>
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Цель основателя</h3>
                    <p className="text-gray-700">
                      "Моя цель — создать экосистему, где каждый человек может получить персонализированные 
                      рекомендации для улучшения здоровья и продления жизни, основанные на самых последних научных 
                      открытиях и технологиях. Мы стремимся сделать современную науку о долголетии доступной и 
                      применимой в повседневной жизни."
                    </p>
                    <div className="mt-4">
                      <p className="font-semibold">Гайнутдинов Камиль Рафитович</p>
                      <p className="text-gray-600">CEO и основатель EVERLIV</p>
                    </div>
                  </CardContent>
                </Card>
                <Button>Узнать больше о нашей миссии</Button>
              </div>
            </div>
          </div>
        </section>
        
        <MissionSection />
        <ScienceSection />
        <TechnologySection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
