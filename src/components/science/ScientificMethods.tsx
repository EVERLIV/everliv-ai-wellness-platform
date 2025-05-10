
import React from "react";
import { Snowflake, Utensils, Waves, CircleDashed, Pill } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ScientificMethods = () => {
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

  // Shortened tab names to fit better in UI
  const tabNames = ["cold", "fasting", "breathing", "oxygen", "supplements"];
  const shortNames = ["Холод", "Голод", "Дых", "O₂", "Доб"];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Научно обоснованные методы</h2>
        
        <Tabs defaultValue="cold" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-5 mb-8">
            {scientificMethods.map((method, index) => (
              <TabsTrigger key={index} value={tabNames[index]} className="w-full py-3 px-2 flex flex-col items-center">
                <div className="p-2 bg-white rounded-full shadow-sm flex items-center justify-center">
                  {method.icon}
                </div>
                <span className="mt-2 text-xs font-medium whitespace-nowrap text-center">
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
  );
};

export default ScientificMethods;
