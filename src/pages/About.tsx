
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TeamSection from "@/components/about/TeamSection";
import MissionSection from "@/components/about/MissionSection";
import ScienceSection from "@/components/about/ScienceSection";
import TechnologySection from "@/components/about/TechnologySection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, Clock, Users, BarChart4, ShieldCheck } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
                <Card className="shadow-md overflow-hidden">
                  <AspectRatio ratio={4/5}>
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/30 w-full h-full flex flex-col items-center justify-center p-8">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-center mb-4">500,000+</h3>
                      <p className="text-center text-gray-700">Счастливых пользователей платформы</p>
                    </div>
                  </AspectRatio>
                </Card>
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
        
        {/* Company Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Преимущества EVERLIV</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Card className="border-primary/20 hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Научная обоснованность</h3>
                    <p className="text-gray-600 mb-4">
                      Все рекомендации основаны на последних научных исследованиях и публикациях в ведущих медицинских журналах.
                    </p>
                    <Button variant="outline" size="sm" className="mt-auto">
                      Подробнее <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20 hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <BarChart4 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Персонализированный подход</h3>
                    <p className="text-gray-600 mb-4">
                      Индивидуальные рекомендации, основанные на уникальных данных вашего организма и образа жизни.
                    </p>
                    <Button variant="outline" size="sm" className="mt-auto">
                      Подробнее <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20 hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Защита данных</h3>
                    <p className="text-gray-600 mb-4">
                      Полная конфиденциальность и безопасность всех ваших медицинских данных и личной информации.
                    </p>
                    <Button variant="outline" size="sm" className="mt-auto">
                      Подробнее <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Infographics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">Ключевые результаты</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-primary">98%</span>
                      </div>
                      <div>
                        <p className="font-medium">Пользователей отмечают улучшение самочувствия</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-secondary">87%</span>
                      </div>
                      <div>
                        <p className="font-medium">Улучшение биомаркеров крови за 3 месяца</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-secondary h-2.5 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-primary">92%</span>
                      </div>
                      <div>
                        <p className="font-medium">Повышение энергии и работоспособности</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Button>Подробнее о результатах</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">Наша технология</h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4 text-white font-bold">1</div>
                      <div>
                        <p className="font-medium">Сбор и анализ данных</p>
                        <p className="text-sm text-gray-600">Комплексный анализ биомаркеров и образа жизни</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4 text-white font-bold">2</div>
                      <div>
                        <p className="font-medium">ИИ обработка</p>
                        <p className="text-sm text-gray-600">Анализ данных с помощью искусственного интеллекта</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4 text-white font-bold">3</div>
                      <div>
                        <p className="font-medium">Персонализация рекомендаций</p>
                        <p className="text-sm text-gray-600">Создание индивидуального протокола здоровья</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4 text-white font-bold">4</div>
                      <div>
                        <p className="font-medium">Мониторинг и корректировка</p>
                        <p className="text-sm text-gray-600">Постоянное отслеживание и обновление рекомендаций</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Button>Узнать больше о технологии</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <MissionSection />
        <ScienceSection />
        <TechnologySection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
