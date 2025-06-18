
import React from "react";
import { Heart, FileText, Utensils, Activity, Brain, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";

const DashboardQuickActions = () => {
  const { canUseFeature } = useSubscription();

  const actions = [
    {
      title: "Профиль здоровья",
      description: "Создайте полный профиль здоровья с персональными данными, медицинской историей и результатами анализов",
      icon: Heart,
      href: "/health-profile",
      color: "text-red-500",
      bgColor: "bg-red-50",
      gradient: "from-red-50 to-red-100",
      available: true,
      badge: { text: "Основа", variant: "secondary" as const },
      features: ["Медицинская история", "Лабораторные показатели", "Персонализация"]
    },
    {
      title: "Ваши Анализы",
      description: "Загружайте и анализируйте результаты лабораторных исследований с помощью ИИ для получения персональных рекомендаций",
      icon: FileText,
      href: "/lab-analyses",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      gradient: "from-blue-50 to-blue-100",
      available: canUseFeature(FEATURES.BLOOD_ANALYSIS),
      badge: { text: "ИИ-анализ", variant: "default" as const },
      features: ["Умный анализ", "Рекомендации", "Трекинг динамики"]
    },
    {
      title: "Дневник питания",
      description: "Ведите детальный учет питания с анализом калорийности, макронутриентов и получайте персональные диетические рекомендации",
      icon: Utensils,
      href: "/nutrition-diary",
      color: "text-green-500",
      bgColor: "bg-green-50",
      gradient: "from-green-50 to-green-100",
      available: canUseFeature(FEATURES.NUTRITION_DIARY),
      badge: { text: "Pro", variant: "secondary" as const },
      features: ["Подсчет калорий", "Анализ БЖУ", "Персональные советы"]
    },
    {
      title: "Аналитика здоровья",
      description: "Получайте комплексную аналитику здоровья на основе всех ваших данных с прогнозами и детальными рекомендациями",
      icon: Activity,
      href: "/analytics",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      gradient: "from-purple-50 to-purple-100",
      available: canUseFeature(FEATURES.ANALYTICS),
      badge: { text: "Премиум", variant: "default" as const },
      features: ["Глубокая аналитика", "Прогнозы", "Персональный план"]
    },
    {
      title: "ИИ-доктор",
      description: "Консультируйтесь с искусственным интеллектом по вопросам здоровья, получайте медицинские рекомендации 24/7",
      icon: Brain,
      href: "/ai-doctor",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      gradient: "from-indigo-50 to-indigo-100",
      available: canUseFeature(FEATURES.CHAT_MESSAGES),
      badge: { text: "ИИ", variant: "default" as const },
      features: ["24/7 доступность", "Медицинская база", "Персональные ответы"]
    },
    {
      title: "База знаний",
      description: "Изучайте медицинскую информацию, статьи экспертов, научные исследования и расширяйте знания о здоровье",
      icon: BookOpen,
      href: "/medical-knowledge",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      gradient: "from-orange-50 to-orange-100",
      available: true,
      badge: { text: "Обучение", variant: "secondary" as const },
      features: ["Экспертные статьи", "Научные данные", "Образовательный контент"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <Card key={index} className={`group relative overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${action.gradient}`}>
          <div className="absolute top-0 right-0 p-3">
            <Badge variant={action.badge.variant} className="text-xs font-medium shadow-sm">
              {action.badge.text}
            </Badge>
          </div>
          
          <CardHeader className="pb-4 pt-6">
            <div className={`w-14 h-14 ${action.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white/50`}>
              <action.icon className={`h-7 w-7 ${action.color}`} />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 leading-tight">
              {action.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {action.description}
            </p>
            
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Возможности:
              </div>
              <div className="flex flex-wrap gap-1">
                {action.features.map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2 py-1 bg-white/60 text-gray-700 rounded-full border border-gray-200/50"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              {action.available ? (
                <Link to={action.href}>
                  <Button className="w-full font-medium shadow-sm hover:shadow-md transition-shadow duration-200">
                    Перейти к функции
                  </Button>
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700 font-medium text-center">
                      🔒 Требуется подписка для доступа
                    </p>
                  </div>
                  <Link to="/dashboard/subscription">
                    <Button 
                      variant="outline" 
                      className="w-full border-everliv-600 text-everliv-600 hover:bg-everliv-50 font-medium"
                    >
                      Активировать подписку
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
