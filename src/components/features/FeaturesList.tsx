
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Scatter, ScatterChart, ZAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Activity, FileSearch, User, Pill, HeartPulse, ChartPie } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

const FeaturesList = () => {
  const features: Feature[] = [
    {
      id: "ai-analysis",
      title: "Анализ здоровья с помощью ИИ",
      description: "Комплексная оценка состояния организма на основе ваших биомаркеров, анализов и образа жизни",
      icon: <Activity className="h-6 w-6 text-evergreen-500" />,
      benefits: [
        "Выявление скрытых проблем со здоровьем на ранних стадиях",
        "Оценка биологического возраста и потенциала долголетия",
        "Определение индивидуальных рисков заболеваний"
      ]
    },
    {
      id: "blood-analysis",
      title: "Интерпретация анализов крови",
      description: "Расшифровка результатов анализов крови с персональными рекомендациями от ИИ",
      icon: <FileSearch className="h-6 w-6 text-evergreen-500" />,
      benefits: [
        "Понятное объяснение всех показателей на простом языке",
        "Сравнение с оптимальными значениями для вашего возраста и пола",
        "Отслеживание динамики изменений во времени"
      ]
    },
    {
      id: "personalized-recommendations",
      title: "Персонализированные рекомендации",
      description: "Индивидуальная стратегия по улучшению здоровья, адаптированная под ваши особенности",
      icon: <User className="h-6 w-6 text-evergreen-500" />,
      benefits: [
        "Подбор оптимального рациона питания",
        "Рекомендации по физической активности",
        "Советы по управлению стрессом и улучшению сна"
      ]
    },
    {
      id: "supplements",
      title: "Подбор витаминов и добавок",
      description: "Научно обоснованные рекомендации по нутрицевтикам на основе ваших индивидуальных потребностей",
      icon: <Pill className="h-6 w-6 text-evergreen-500" />,
      benefits: [
        "Анализ потребностей организма в микронутриентах",
        "Устранение дефицитов с учетом ваших особенностей",
        "Оптимальные дозировки и схемы приема"
      ]
    },
    {
      id: "monitoring",
      title: "Мониторинг состояния здоровья",
      description: "Непрерывное отслеживание показателей здоровья и корректировка рекомендаций",
      icon: <HeartPulse className="h-6 w-6 text-evergreen-500" />,
      benefits: [
        "Динамическое отслеживание ключевых биомаркеров",
        "Своевременное выявление негативных изменений",
        "Персонализированные уведомления и напоминания"
      ]
    },
    {
      id: "complex-assessment",
      title: "Комплексная оценка здоровья",
      description: "Всеобъемлющий анализ факторов, влияющих на ваше здоровье и долголетие",
      icon: <ChartPie className="h-6 w-6 text-evergreen-500" />,
      benefits: [
        "Интеграция данных из различных источников",
        "Оценка физического и психического здоровья",
        "Прогнозирование долгосрочных трендов"
      ]
    }
  ];
  
  const renderFeatureChart = (id: string) => {
    switch (id) {
      case "ai-analysis":
        // Radar Chart для анализа здоровья
        const radarData = [
          { subject: 'Физическое', value: 85, fullMark: 100 },
          { subject: 'Ментальное', value: 75, fullMark: 100 },
          { subject: 'Иммунитет', value: 80, fullMark: 100 },
          { subject: 'Сердце', value: 90, fullMark: 100 },
          { subject: 'Энергия', value: 85, fullMark: 100 },
          { subject: 'Сон', value: 78, fullMark: 100 },
        ];
        return (
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart outerRadius={80} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name="Здоровье" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case "blood-analysis":
        // Bar Chart для анализов крови
        const bloodData = [
          { name: 'Гемоглобин', value: 88, норма: 100 },
          { name: 'Лейкоциты', value: 95, норма: 100 },
          { name: 'Глюкоза', value: 75, норма: 100 },
          { name: 'Холестерин', value: 65, норма: 100 },
          { name: 'Ферритин', value: 70, норма: 100 },
        ];
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bloodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Ваши показатели" />
              <Bar dataKey="норма" fill="#8884d8" name="Норма" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "personalized-recommendations":
        // Line Chart для персонализированных рекомендаций (прогресс со временем)
        const recommendationsData = [
          { месяц: 'Янв', индекс: 40 },
          { месяц: 'Фев', индекс: 45 },
          { месяц: 'Мар', индекс: 60 },
          { месяц: 'Апр', индекс: 75 },
          { месяц: 'Май', индекс: 85 },
        ];
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={recommendationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="месяц" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="индекс" stroke="#8884d8" name="Индекс здоровья" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "supplements":
        // Pie Chart для витаминов и добавок
        const supplementsData = [
          { name: 'Витамин D', value: 30 },
          { name: 'Омега-3', value: 25 },
          { name: 'Магний', value: 20 },
          { name: 'Цинк', value: 15 },
          { name: 'B-комплекс', value: 10 },
        ];
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={supplementsData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supplementsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "monitoring":
        // Area Chart для мониторинга состояния
        const monitoringData = [
          { день: '1', пульс: 75, давление: 120, сон: 7.5 },
          { день: '3', пульс: 72, давление: 118, сон: 8.0 },
          { день: '5', пульс: 76, давление: 125, сон: 6.5 },
          { день: '7', пульс: 73, давление: 115, сон: 7.0 },
          { день: '9', пульс: 70, давление: 110, сон: 8.5 },
        ];
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monitoringData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="день" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="пульс" stroke="#8884d8" fill="#8884d8" name="Пульс" />
              <Area type="monotone" dataKey="сон" stroke="#82ca9d" fill="#82ca9d" name="Сон (часы)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case "complex-assessment":
        // Scatter Chart для комплексной оценки
        const complexData = [
          { x: 65, y: 75, z: 80, name: 'Сейчас' },
          { x: 75, y: 85, z: 90, name: 'Через 3 мес.' },
          { x: 90, y: 95, z: 100, name: 'Цель' },
        ];
        return (
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="физическое" />
              <YAxis type="number" dataKey="y" name="ментальное" />
              <ZAxis type="number" dataKey="z" range={[60, 400]} name="общее" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({payload}) => {
                if (payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                      <p>{`${payload[0].payload.name}`}</p>
                      <p>{`Физическое: ${payload[0].value}`}</p>
                      <p>{`Ментальное: ${payload[0].payload.y}`}</p>
                      <p>{`Общее: ${payload[0].payload.z}`}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Scatter name="Здоровье" data={complexData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-everliv-800">Наши ключевые функции</h2>
          <p className="text-lg text-gray-600">
            EVERLIV предлагает полный спектр инструментов для управления вашим здоровьем, 
            основанных на передовых технологиях искусственного интеллекта и научных данных.
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div key={feature.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}>
              <div className="lg:w-1/2">
                <div className="rounded-lg overflow-hidden shadow-lg bg-white p-4">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full mr-3">{feature.icon}</div>
                    <h4 className="text-xl font-medium">{feature.title}</h4>
                  </div>
                  {renderFeatureChart(feature.id)}
                </div>
              </div>
              <div className="lg:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-everliv-800">{feature.title}</h3>
                <p className="text-lg mb-6 text-gray-600">{feature.description}</p>
                <div className="space-y-3 mb-8">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start">
                      <div className="bg-evergreen-500 rounded-full p-1 mr-3 mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Link to={`/feature/${feature.id}`}>
                  <Button className="bg-everliv-600 hover:bg-everliv-700 text-white">
                    Подробнее о функции
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;
