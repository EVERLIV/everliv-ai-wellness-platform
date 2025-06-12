
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare, TrendingUp, TestTube2, Crown, Apple, Heart, User, BarChart3, BookOpen } from "lucide-react";
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
      title: "Аналитика здоровья",
      subtitle: "Комплексный анализ",
      icon: BarChart3,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      path: "/analytics",
      description: "Персональная аналитика здоровья на основе ваших данных с рекомендациями ИИ-доктора",
      premium: false
    },
    {
      title: "База знаний",
      subtitle: "В разработке",
      icon: BookOpen,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      path: "/medical-knowledge",
      description: "Изучайте информацию о симптомах, заболеваниях и методах лечения",
      premium: false,
      status: "development"
    }
  ];

  return (
    <div className="space-y-6">
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
                  {action.status === 'complete' && (
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  )}
                  {action.status === 'incomplete' && (
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                  )}
                  {action.status === 'development' && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      В разработке
                    </span>
                  )}
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
                      {action.status === 'complete' && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Заполнен
                        </span>
                      )}
                      {action.status === 'incomplete' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Не заполнен
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
      
      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <p>
          Сервис находится в альфа-разработке. Спасибо за поддержку! 
          {" "}
          <a 
            href="/contact" 
            className="text-primary hover:underline font-medium"
          >
            Рассказать о баге
          </a>
        </p>
      </div>
    </div>
  );
};

export default DashboardQuickActions;
