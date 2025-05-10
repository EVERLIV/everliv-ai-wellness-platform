
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Snowflake, Utensils, Waves, CircleDashed, Pill } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ScienceSection from "@/components/about/ScienceSection";

const Science = () => {
  const scientificMethods = [
    {
      icon: <Snowflake className="w-8 h-8 text-blue-500" />,
      title: "Холодовые воздействия",
      description: "Закаливание и холодовые воздействия активируют бурый жир, укрепляют иммунитет и повышают стрессоустойчивость организма. Регулярное воздействие холода также способствует выработке норадреналина и повышению клеточной стойкости.",
      research: [
        { title: "Влияние холодовых воздействий на иммунную функцию", authors: "Janský L. et al., 2006" },
        { title: "Механизмы адаптации к холоду и термогенез", authors: "van Marken Lichtenbelt W. et al., 2014" }
      ]
    },
    {
      icon: <Utensils className="w-8 h-8 text-amber-500" />,
      title: "Пролонгированное и интервальное голодание",
      description: "Периодическое голодание активирует аутофагию, процесс очищения клеток от поврежденных органелл. Это приводит к улучшению метаболизма, чувствительности к инсулину и снижению воспаления.",
      research: [
        { title: "Интервальное голодание и метаболическое здоровье", authors: "Mattson M.P. et al., 2019" },
        { title: "Механизмы аутофагии при голодании", authors: "Mizushima N. et al., 2018" }
      ]
    },
    {
      icon: <Waves className="w-8 h-8 text-green-500" />,
      title: "Дыхательные практики",
      description: "Метод Вим Хофа и другие дыхательные практики позволяют осознанно влиять на автономную нервную систему, снижая уровень стресса и улучшая когнитивные функции.",
      research: [
        { title: "Влияние метода Вим Хофа на иммунный ответ", authors: "Kox M. et al., 2014" },
        { title: "Нейрофизиологические эффекты глубокого дыхания", authors: "Brown R.P. et al., 2013" }
      ]
    },
    {
      icon: <CircleDashed className="w-8 h-8 text-purple-500" />,
      title: "Кислородная терапия",
      description: "Гипербарическая оксигенация повышает уровень кислорода в тканях, что способствует ускоренному восстановлению, регенерации и улучшению клеточного здоровья.",
      research: [
        { title: "Кислородная терапия в регенеративной медицине", authors: "Thom S.R. et al., 2015" },
        { title: "НВОТ при нейродегенеративных заболеваниях", authors: "Hadanny A. et al., 2020" }
      ]
    },
    {
      icon: <Pill className="w-8 h-8 text-rose-500" />,
      title: "Качественные добавки",
      description: "Определенные добавки, основанные на индивидуальных потребностях, могут значительно улучшить здоровье, восполняя дефициты или оптимизируя работу организма.",
      research: [
        { title: "Противовоспалительное действие Омега-3 кислот", authors: "Calder P.C. et al., 2017" },
        { title: "Метаанализ влияния витамина D на иммунитет", authors: "Martineau A.R. et al., 2019" }
      ]
    }
  ];

  const tabNames = ["cold", "fasting", "breathing", "oxygen", "supplements"];
  const shortNames = ["Холодовые", "Голодание", "Дыхание", "Кислород", "Добавки"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Научная база EVERLIV</h1>
              <p className="text-lg text-gray-600 mb-8">
                Все методы и подходы EVERLIV основаны на научных исследованиях и проверенных практиках.
                Узнайте, как древняя мудрость и современная наука работают вместе для улучшения вашего здоровья.
              </p>
              <div className="mt-6">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                  alt="Научные исследования"
                  className="rounded-lg shadow-md mx-auto max-w-full h-auto object-cover"
                  style={{ maxHeight: "400px" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Scientific Methods Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Научно обоснованные методы</h2>
            
            <Tabs defaultValue="cold" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-5 mb-8">
                {scientificMethods.map((method, index) => (
                  <TabsTrigger key={index} value={tabNames[index]} className="w-full py-3 px-2 flex flex-col items-center">
                    <div className="p-1 bg-white rounded-full shadow-sm">
                      {method.icon}
                    </div>
                    <span className="mt-2 text-xs font-medium whitespace-normal text-center">
                      {shortNames[index]}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {scientificMethods.map((method, index) => (
                <TabsContent key={index} value={tabNames[index]} className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 bg-white p-3 rounded-full shadow-sm">
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{method.title}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{method.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Ключевые исследования:</h4>
                    <ul className="space-y-2">
                      {method.research.map((item, idx) => (
                        <li key={idx} className="bg-white p-3 rounded border border-gray-200">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.authors}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Scientific Approach */}
        <ScienceSection />

        {/* Expert Collaboration */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Сотрудничество с экспертами</h2>
              <p className="text-lg text-gray-600 mb-8">
                Мы работаем с ведущими специалистами в области долголетия, функциональной медицины и нутрициологии
                для создания наиболее эффективных программ оздоровления.
              </p>
              <Link to="/webinars">
                <Button>Узнать о наших экспертных вебинарах</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Science;
