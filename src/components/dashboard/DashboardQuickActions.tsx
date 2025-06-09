
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare, TrendingUp, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  {
    title: "Анализы",
    subtitle: "Загрузить и просмотреть",
    icon: FileText,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    path: "/blood-analysis"
  },
  {
    title: "ИИ-Доктор",
    subtitle: "Консультация",
    icon: MessageSquare,
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
    path: "/dashboard"
  },
  {
    title: "Тренды",
    subtitle: "Динамика здоровья",
    icon: TrendingUp,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    path: "/analytics"
  },
  {
    title: "Профиль",
    subtitle: "Настройки",
    icon: Settings,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    path: "/profile"
  }
];

const DashboardQuickActions = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action, index) => (
        <Link key={index} to={action.path}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 rounded-full ${action.iconBg} flex items-center justify-center mx-auto mb-3`}>
                <action.icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.subtitle}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
