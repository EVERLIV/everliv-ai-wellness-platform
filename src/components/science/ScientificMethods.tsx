
import React from "react";
import { Snowflake, Utensils, Waves, CircleDashed, Pill } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ScientificMethods = () => {
  const scientificMethods = [
    {
      icon: <Snowflake className="w-10 h-10 text-blue-500" />,
      title: "Холодовые воздействия",
      description: "Закаливание и холодовые воздействия активируют бурый жир, укрепляют иммунитет и повышают стрессоустойчивость организма. Регулярное воздействие холода также способствует выработке норадреналина и повышению клеточной стойкости.",
      research: [
        { title: "Влияние холодовых воздействий на иммунную функцию", authors: "Janský L. et al., 2006" },
        { title: "Механизмы адаптации к холоду и термогенез", authors: "van Marken Lichtenbelt W. et al., 2014" }
      ],
      chartData: [
        { name: "До", иммунитет: 45, стрессоустойчивость: 50, метаболизм: 40 },
        { name: "1 мес", иммунитет: 55, стрессоустойчивость: 60, метаболизм: 55 },
        { name: "3 мес", иммунитет: 70, стрессоустойчивость: 75, метаболизм: 65 },
        { name: "6 мес", иммунитет: 85, стрессоустойчивость: 90, метаболизм: 80 }
      ]
    },
    {
      icon: <Utensils className="w-10 h-10 text-amber-500" />,
      title: "Интервальное голодание",
      description: "Периодическое голодание активирует аутофагию, процесс очищения клеток от поврежденных органелл. Это приводит к улучшению метаболизма, чувствительности к инсулину и снижению воспаления.",
      research: [
        { title: "Интервальное голодание и метаболическое здоровье", authors: "Mattson M.P. et al., 2019" },
        { title: "Механизмы аутофагии при голодании", authors: "Mizushima N. et al., 2018" }
      ],
      chartData: [
        { name: "12:12", аутофагия: 30, воспаление: 65, метаболизм: 40 },
        { name: "16:8", аутофагия: 55, воспаление: 50, метаболизм: 60 },
        { name: "18:6", аутофагия: 70, воспаление: 35, метаболизм: 75 },
        { name: "20:4", аутофагия: 85, воспаление: 25, метаболизм: 85 }
      ]
    },
    {
      icon: <Waves className="w-10 h-10 text-green-500" />,
      title: "Дыхательные практики",
      description: "Метод Вим Хофа и другие дыхательные практики позволяют осознанно влиять на автономную нервную систему, снижая уровень стресса и улучшая когнитивные функции.",
      research: [
        { title: "Влияние метода Вим Хофа на иммунный ответ", authors: "Kox M. et al., 2014" },
        { title: "Нейрофизиологические эффекты глубокого дыхания", authors: "Brown R.P. et al., 2013" }
      ],
      pieData: [
        { name: "Снижение стресса", value: 40 },
        { name: "Иммунитет", value: 25 },
        { name: "Энергия", value: 20 },
        { name: "Когнитивность", value: 15 }
      ]
    },
    {
      icon: <CircleDashed className="w-10 h-10 text-purple-500" />,
      title: "Кислородная терапия",
      description: "Гипербарическая оксигенация повышает уровень кислорода в тканях, что способствует ускоренному восстановлению, регенерации и улучшению клеточного здоровья.",
      research: [
        { title: "Кислородная терапия в регенеративной медицине", authors: "Thom S.R. et al., 2015" },
        { title: "НВОТ при нейродегенеративных заболеваниях", authors: "Hadanny A. et al., 2020" }
      ],
      areaData: [
        { name: "Начало", восстановление: 30, регенерация: 20, когнитивность: 25 },
        { name: "1 сеанс", восстановление: 40, регенерация: 30, когнитивность: 35 },
        { name: "5 сеансов", восстановление: 60, регенерация: 50, когнитивность: 55 },
        { name: "10 сеансов", восстановление: 80, регенерация: 70, когнитивность: 75 }
      ]
    },
    {
      icon: <Pill className="w-10 h-10 text-rose-500" />,
      title: "Качественные добавки",
      description: "Определенные добавки, основанные на индивидуальных потребностях, могут значительно улучшить здоровье, восполняя дефициты или оптимизируя работу организма.",
      research: [
        { title: "Противовоспалительное действие Омега-3 кислот", authors: "Calder P.C. et al., 2017" },
        { title: "Метаанализ влияния витамина D на иммунитет", authors: "Martineau A.R. et al., 2019" }
      ],
      barData: [
        { name: "Омега-3", значение: 85 },
        { name: "Витамин D", значение: 75 },
        { name: "Магний", значение: 65 },
        { name: "Цинк", значение: 60 },
        { name: "Витамин C", значение: 55 }
      ]
    }
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Научно обоснованные методы</h2>
        
        <div className="space-y-16">
          {scientificMethods.map((method, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className={`grid md:grid-cols-2 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="p-8 bg-gray-50 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-full bg-white shadow-sm mr-4">
                        {method.icon}
                      </div>
                      <h3 className="text-2xl font-bold">{method.title}</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-6 text-lg">{method.description}</p>
                    
                    <div>
                      <h4 className="font-medium text-lg mb-3">Ключевые исследования:</h4>
                      <ul className="space-y-3">
                        {method.research.map((item, idx) => (
                          <li key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <p className="font-medium text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.authors}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-6 flex items-center justify-center">
                    <div className="w-full h-80">
                      {/* Различные графики для разных методов */}
                      {index === 0 && (
                        <>
                          <h4 className="text-center text-lg font-medium mb-4">Динамика показателей при регулярных холодовых воздействиях</h4>
                          <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={method.chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="иммунитет" stroke="#8884d8" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="стрессоустойчивость" stroke="#82ca9d" />
                              <Line type="monotone" dataKey="метаболизм" stroke="#ffc658" />
                            </LineChart>
                          </ResponsiveContainer>
                        </>
                      )}
                      
                      {index === 1 && (
                        <>
                          <h4 className="text-center text-lg font-medium mb-4">Показатели здоровья при разных режимах голодания</h4>
                          <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={method.chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="аутофагия" fill="#8884d8" />
                              <Bar dataKey="метаболизм" fill="#82ca9d" />
                              <Bar dataKey="воспаление" fill="#ffc658" />
                            </BarChart>
                          </ResponsiveContainer>
                        </>
                      )}
                      
                      {index === 2 && (
                        <>
                          <h4 className="text-center text-lg font-medium mb-4">Влияние дыхательных практик</h4>
                          <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                              <Pie
                                data={method.pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {method.pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </>
                      )}
                      
                      {index === 3 && (
                        <>
                          <h4 className="text-center text-lg font-medium mb-4">Эффективность кислородной терапии</h4>
                          <ResponsiveContainer width="100%" height="90%">
                            <AreaChart data={method.areaData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Area type="monotone" dataKey="восстановление" stackId="1" stroke="#8884d8" fill="#8884d8" />
                              <Area type="monotone" dataKey="регенерация" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                              <Area type="monotone" dataKey="когнитивность" stackId="1" stroke="#ffc658" fill="#ffc658" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </>
                      )}
                      
                      {index === 4 && (
                        <>
                          <h4 className="text-center text-lg font-medium mb-4">Эффективность добавок (в %)</h4>
                          <ResponsiveContainer width="100%" height="90%">
                            <BarChart
                              layout="vertical"
                              data={method.barData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="значение" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScientificMethods;
