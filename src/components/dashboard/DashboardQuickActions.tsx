
import React from "react";
import { Heart, FileText, Utensils, Activity, Brain, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";

const DashboardQuickActions = () => {
  const { canUseFeature } = useSubscription();

  const actions = [
    {
      title: "Профиль здоровья",
      description: "Заполните данные о вашем здоровье",
      icon: Heart,
      href: "/health-profile",
      color: "text-red-500",
      bgColor: "bg-red-50",
      available: true
    },
    {
      title: "Ваши Анализы",
      description: "Загрузите результаты анализов",
      icon: FileText,
      href: "/lab-analyses",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      available: canUseFeature(FEATURES.BLOOD_ANALYSIS)
    },
    {
      title: "Дневник питания",
      description: "Отслеживайте питание",
      icon: Utensils,
      href: "/nutrition-diary",
      color: "text-green-500",
      bgColor: "bg-green-50",
      available: canUseFeature(FEATURES.NUTRITION_DIARY)
    },
    {
      title: "Аналитика здоровья",
      description: "Просмотрите детальную аналитику",
      icon: Activity,
      href: "/analytics",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      available: canUseFeature(FEATURES.ANALYTICS)
    },
    {
      title: "ИИ-доктор",
      description: "Консультация с ИИ",
      icon: Brain,
      href: "/ai-doctor",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      available: canUseFeature(FEATURES.CHAT_MESSAGES)
    },
    {
      title: "Мои протоколы",
      description: "Отслеживайте протоколы здоровья",
      icon: Calendar,
      href: "/my-protocols",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      available: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <Card key={index} className="group hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300">
          <CardHeader className="pb-3">
            <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className={`h-6 w-6 ${action.color}`} />
            </div>
            <CardTitle className="text-lg font-medium">{action.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
              {action.description}
            </p>
            {action.available ? (
              <Link to={action.href}>
                <Button className="w-full" variant="outline">
                  Перейти
                </Button>
              </Link>
            ) : (
              <div className="text-center">
                <p className="text-xs text-amber-600 mb-2">
                  Требуется подписка
                </p>
                <Link to="/dashboard/subscription">
                  <Button variant="outline" size="sm" className="w-full border-everliv-600 text-everliv-600 hover:bg-everliv-50">
                    Активировать
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
