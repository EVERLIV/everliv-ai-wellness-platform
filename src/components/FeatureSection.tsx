
import { 
  Activity, Heart, FileText, 
  PieChart, Database, Shield, 
  BookOpen, Search
} from 'lucide-react';

export default function FeatureSection() {
  const features = [
    {
      icon: <FileText className="w-10 h-10 text-everliv-600" />,
      title: "Анализ результатов анализов",
      description: "Загружайте результаты анализов крови и получайте интеллектуальную интерпретацию показателей и выявление отклонений."
    },
    {
      icon: <Search className="w-10 h-10 text-everliv-600" />,
      title: "Помощь в диагностике",
      description: "Получайте информацию и рекомендации на основе симптомов и данных вашего профиля."
    },
    {
      icon: <Heart className="w-10 h-10 text-evergreen-500" />,
      title: "Персонализированные рекомендации",
      description: "Индивидуальные советы по питанию, образу жизни и физическим нагрузкам на основе ваших данных."
    },
    {
      icon: <Activity className="w-10 h-10 text-evergreen-500" />,
      title: "Мониторинг состояния здоровья",
      description: "Отслеживайте ключевые показатели здоровья и наблюдайте прогресс с помощью наглядных графиков."
    },
    {
      icon: <PieChart className="w-10 h-10 text-everliv-600" />,
      title: "Комплексная оценка здоровья",
      description: "Интерактивные опросники и инструменты для глубокой оценки текущего состояния вашего здоровья."
    },
    {
      icon: <Database className="w-10 h-10 text-evergreen-500" />,
      title: "Рекомендации по добавкам",
      description: "Персонализированные рекомендации по приему витаминов и добавок с проверкой взаимодействий."
    },
    {
      icon: <Shield className="w-10 h-10 text-everliv-600" />,
      title: "Защита данных",
      description: "Высочайший уровень безопасности и конфиденциальности для защиты ваших медицинских данных."
    },
    {
      icon: <BookOpen className="w-10 h-10 text-evergreen-500" />,
      title: "Научный подход",
      description: "Все рекомендации основаны на научных исследованиях и доказательной медицине."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-6">Ключевые возможности платформы</h2>
          <p className="text-lg text-gray-600">
            EVERLIV сочетает в себе передовой искусственный интеллект и доказательную медицину для обеспечения комплексной заботы о вашем здоровье и долголетии.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-everliv-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
