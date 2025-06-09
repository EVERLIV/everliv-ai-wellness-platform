
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare, TrendingUp, Settings, TestTube2, Crown } from "lucide-react";
import { Link } from "react-router-dom";

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
    path: "/ai-doctor/personal",
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
    title: "Профиль",
    subtitle: "Настройки",
    icon: Settings,
    iconColor: "text-slate-600",
    iconBg: "bg-slate-50",
    path: "/profile",
    description: "Управление аккаунтом и персональными данными",
    premium: false
  }
];

const DashboardQuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickActions.map((action, index) => (
        <Link key={index} to={action.path} className="group">
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white group-hover:scale-[1.02] h-full relative">
            {action.premium && (
              <div className="absolute top-3 right-3">
                <Crown className="h-4 w-4 text-amber-500" />
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
