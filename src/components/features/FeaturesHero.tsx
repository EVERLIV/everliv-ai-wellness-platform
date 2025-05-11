
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";

const FeaturesHero = () => {
  const healthMetricsData = [
    { subject: 'Физ. здоровье', A: 90, B: 60, fullMark: 100 },
    { subject: 'Питание', A: 85, B: 50, fullMark: 100 },
    { subject: 'Сон', A: 88, B: 65, fullMark: 100 },
    { subject: 'Стресс', A: 70, B: 45, fullMark: 100 },
    { subject: 'Иммунитет', A: 82, B: 55, fullMark: 100 },
    { subject: 'Энергия', A: 87, B: 58, fullMark: 100 },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 font-heading text-gray-900">
              Возможности платформы EVERLIV
            </h1>
            <p className="text-md text-gray-600 mb-8">
              Откройте для себя полный спектр инструментов для оптимизации вашего здоровья и увеличения продолжительности жизни
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-center">Сравнение показателей здоровья</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} data={healthMetricsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="С EVERLIV"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Без EVERLIV"
                    dataKey="B"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Данные основаны на среднестатистических показателях пользователей через 3 месяца использования платформы
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesHero;
