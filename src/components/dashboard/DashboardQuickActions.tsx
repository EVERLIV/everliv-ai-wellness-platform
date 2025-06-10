
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare, TrendingUp, Settings, TestTube2, Crown, Apple, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useHealthProfile } from "@/hooks/useHealthProfile";

const DashboardQuickActions = () => {
  const { healthProfile } = useHealthProfile();
  
  // Проверяем заполненность профиля здоровья
  const isHealthProfileComplete = () => {
    if (!healthProfile) return false;
    
    const requiredFields = ['age', 'gender', 'height', 'weight'];
    return requiredFields.every(field => healthProfile[field as keyof typeof healthProfile]);
  };

  const healthProfileComplete = isHealthProfileComplete();

  const quickActions = [
    {
      title: "Лабораторные анализы",
      subtitle: "Загрузить и просмотреть",
      icon: TestTube2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      path: "/lab-analyses",
      description: "Загрузите результаты анализов и получите детальную расшифровку с помощью ИИ",
      premium: false
    },
    {
      title: "Дневник питания",
      subtitle: "Отслеживание рациона",
      icon: Apple,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      path: "/nutrition-diary",
      description: "Ведите учет питания, устанавливайте цели по БЖУ и получайте персональные рекомендации",
      premium: false
    },
    {
      title: "Профиль здоровья",
      subtitle: healthProfileComplete ? "Заполнен" : "Требует заполнения",
      icon: Heart,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      path: "/health-profile",
      description: "Заполните подробную информацию о вашем здоровье для персональных рекомендаций",
      premium: false,
      status: healthProfileComplete ? "complete" : "incomplete"
    },
    {
      title: "Доктор EVERLIV",
      subtitle: "Персональный ИИ-доктор",
      icon: MessageSquare,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      path: "/ai-doctor",
      description: "Персональные медицинские консультации с доступом к вашей истории и анализам",
      premium: true
    },
    {
      title: "Аналитика",
      subtitle: "Динамика здоровья",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      path: "/analytics",
      description: "Отслеживайте изменения показателей здоровья",
      premium: false
    },
    {
      title: "Настройки",
      subtitle: "Управление аккаунтом",
      icon: Settings,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-50",
      path: "/account-settings",
      description: "Управление аккаунтом и персональными данными",
      premium: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quickActions.map((action, index) => (
        <Link key={index} to={action.path} className="group">
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white group-hover:scale-[1.02] h-full relative">
            {action.premium && (
              <div className="absolute top-3 right-3">
                <Crown className="h-4 w-4 text-amber-500" />
              </div>
            )}
            {action.status && (
              <div className="absolute top-3 right-3">
                <div className={`w-3 h-3 rounded-full ${
                  action.status === 'complete' ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex flex-col items-start space-y-4">
                <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    {action.premium && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        PREMIUM
                      </span>
                    )}
                    {action.status && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        action.status === 'complete' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {action.status === 'complete' ? 'Заполнен' : 'Не заполнен'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {action.description}
                  </p>
                </div>
                
                <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>{action.subtitle}</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
