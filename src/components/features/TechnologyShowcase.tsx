
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

const TechnologyShowcase = () => {
  // Data showing how AI effectiveness improves over time
  const performanceData = [
    { month: 'Янв', Точность: 83, Эффективность: 76 },
    { month: 'Фев', Точность: 85, Эффективность: 78 },
    { month: 'Мар', Точность: 86, Эффективность: 80 },
    { month: 'Апр', Точность: 88, Эффективность: 82 },
    { month: 'Май', Точность: 89, Эффективность: 85 },
    { month: 'Июн', Точность: 91, Эффективность: 88 },
    { month: 'Июл', Точность: 93, Эффективность: 91 },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-everliv-800">
                Технология, которая постоянно совершенствуется
              </h2>
              <p className="text-lg mb-6 text-gray-600">
                Наш ИИ непрерывно обучается на новых данных, внедряя последние научные открытия в области здоровья и долголетия, чтобы обеспечить наиболее точные и актуальные рекомендации.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-evergreen-500 mr-3"></div>
                  <span className="text-gray-700">Самообучающиеся алгоритмы</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-evergreen-500 mr-3"></div>
                  <span className="text-gray-700">Автоматические обновления базы знаний</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-evergreen-500 mr-3"></div>
                  <span className="text-gray-700">Проверка результатов медицинскими экспертами</span>
                </div>
              </div>
            </div>
            <div className="relative bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium mb-4 text-center">Улучшение показателей системы</h3>
              <div className="h-80">
                <ChartContainer
                  config={{
                    accuracy: { color: "#8884d8" },
                    effectiveness: { color: "#82ca9d" },
                  }}
                >
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[70, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Точность"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Эффективность"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;
