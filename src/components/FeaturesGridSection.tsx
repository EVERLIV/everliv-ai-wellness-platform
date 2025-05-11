import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
export default function FeaturesGridSection() {
  const features = [{
    icon: "📊",
    title: "Персональные протоколы",
    description: "Индивидуальные программы холода, голодания и дыхательных практик"
  }, {
    icon: "🧬",
    title: "Загрузка анализов крови",
    description: "Отслеживайте изменения в показателях каждые 2-3 месяца"
  }, {
    icon: "🤖",
    title: "ИИ-анализ и отчеты",
    description: "Автоматическое выявление трендов и потенциальных проблем"
  }, {
    icon: "💊",
    title: "Рекомендации по добавкам",
    description: "Персонализированный подбор добавок и витаминов"
  }, {
    icon: "👥",
    title: "Поддержка сообщества",
    description: "Общение с единомышленниками и консультации экспертов"
  }, {
    icon: "🎁",
    title: "Партнерская программа",
    description: "Зарабатывайте, приглашая друзей и специалистов"
  }, {
    icon: "🎯",
    title: "Персональные челленджи",
    description: "Достигайте целей с помощью геймифицированных задач"
  }, {
    icon: "🏆",
    title: "Отслеживание прогресса",
    description: "Наблюдайте за изменениями и улучшениями в реальном времени"
  }];
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4">Возможности Everliv</h2>
        <p className="text-md text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Наша платформа предлагает широкий спектр инструментов для мониторинга и улучшения вашего здоровья
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => <div key={index} className="flex p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="mr-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xl">{feature.icon}</span>
                </div>
              </div>
              <div>
                <h3 className="text-md mb-1 text-lg font-semibold">{feature.title}</h3>
                <p className="text-gray-600 text-base">{feature.description}</p>
              </div>
            </div>)}
        </div>
        
        <div className="text-center">
          <Link to="/features">
            <Button variant="outline" className="rounded-full text-sm border-primary text-primary hover:bg-primary hover:text-white">
              Посмотреть все возможности
            </Button>
          </Link>
        </div>
      </div>
    </section>;
}