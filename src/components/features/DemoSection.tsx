
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const DemoSection = () => {
  // Data showing distribution of user health improvements
  const userImprovementData = [
    { name: "Значительное улучшение", value: 55 },
    { name: "Умеренное улучшение", value: 30 },
    { name: "Незначительное улучшение", value: 10 },
    { name: "Без изменений", value: 5 },
  ];
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-center">Результаты пользователей</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userImprovementData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userImprovementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Статистика по результатам первых 1000 пользователей за первые 6 месяцев
                </p>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-everliv-800">
                Увидеть платформу в действии
              </h2>
              <p className="text-lg mb-8 text-gray-600">
                Запишитесь на персональную демонстрацию с нашим экспертом, чтобы узнать, как EVERLIV может помочь именно вам. Вы увидите реальные результаты и получите консультацию по вашей ситуации.
              </p>
              <Button className="bg-everliv-600 hover:bg-everliv-700 text-white" size="lg">
                Записаться на демонстрацию
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
