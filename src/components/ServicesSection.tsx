
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Thermometer, Activity, FlaskRound, MapPin, HeartPulse } from "lucide-react";
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  benefits: string[];
}
const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  link,
  benefits
}) => <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white h-full">
    <CardContent className="p-6">
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary mr-3">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        <ul className="mb-6 text-gray-700 space-y-1">
          {benefits.map((benefit, index) => <li key={index} className="flex items-start">
              <span className="text-primary mr-2 text-sm">•</span>
              <span className="text-sm">{benefit}</span>
            </li>)}
        </ul>
        <div className="mt-auto">
          <Link to={link} className="inline-flex items-center text-primary hover:text-secondary transition-colors font-medium">
            Подробнее
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>;
const ServicesSection: React.FC = () => {
  const services = [{
    icon: <Thermometer className="h-5 w-5" />,
    title: "Холодовое воздействие",
    description: "Научно обоснованные методики закаливания и криотерапии для укрепления здоровья и долголетия.",
    link: "/services/cold-therapy",
    benefits: ["Укрепление иммунитета", "Повышение стрессоустойчивости", "Активация бурого жира", "Гормезис и адаптация организма"]
  }, {
    icon: <Activity className="h-5 w-5" />,
    title: "Голодание",
    description: "Различные протоколы периодического голодания для активации аутофагии и оздоровления.",
    link: "/services/fasting",
    benefits: ["Активация аутофагии", "Улучшение метаболического здоровья", "Периодическое голодание", "Ограничение калорий"]
  }, {
    icon: <Brain className="h-5 w-5" />,
    title: "Дыхательные практики",
    description: "Техники осознанного дыхания для улучшения психического и физического здоровья.",
    link: "/services/breathing-practices",
    benefits: ["Снижение уровня стресса", "Улучшение когнитивных функций", "Нормализация кислотно-щелочного баланса", "Повышение энергетического потенциала"]
  }, {
    icon: <FlaskRound className="h-5 w-5" />,
    title: "Кислородная терапия",
    description: "Методы насыщения организма кислородом для восстановления и оздоровления клеток.",
    link: "/services/oxygen-therapy",
    benefits: ["Ускорение восстановления", "Улучшение клеточного здоровья", "Гипербарическая оксигенация", "Противовоспалительное действие"]
  }, {
    icon: <FlaskRound className="h-5 w-5" />,
    title: "Персонализированные добавки",
    description: "Индивидуальные комбинации биоактивных веществ на основе анализа вашего организма.",
    link: "/services/personalized-supplements",
    benefits: ["Нутрицевтики", "Адаптогены", "Пробиотики", "Сенолитики"]
  }, {
    icon: <HeartPulse className="h-5 w-5" />,
    title: "ИИ Рекомендации",
    description: "Персонализированные рекомендации по образу жизни, питанию и добавкам на основе анализа ваших данных.",
    link: "/services/ai-recommendations",
    benefits: ["Рекомендации по образу жизни", "Анализ витаминного профиля", "Персональные протоколы здоровья", "Интеграция с медицинскими данными"]
  }];
  return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => <ServiceCard key={index} icon={service.icon} title={service.title} description={service.description} link={service.link} benefits={service.benefits} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/science" className="inline-flex items-center text-primary hover:text-secondary transition-colors font-medium">
            Научное обоснование наших методик
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>;
};
export default ServicesSection;
