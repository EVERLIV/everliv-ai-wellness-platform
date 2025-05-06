
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  benefits: string[];
}

const features: Feature[] = [
  {
    id: "ai-analysis",
    title: "Анализ здоровья с помощью ИИ",
    description: "Комплексная оценка состояния организма на основе ваших биомаркеров, анализов и образа жизни",
    image: "https://images.unsplash.com/photo-1591706511476-a0ea03abdd17?auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80",
    benefits: [
      "Интеграция данных из различных источников",
      "Оценка физического и психического здоровья",
      "Прогнозирование долгосрочных трендов"
    ]
  }
];

const FeaturesList = () => {
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
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-auto object-cover"
                  />
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
