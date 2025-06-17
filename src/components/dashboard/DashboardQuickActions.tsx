
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  User, 
  MessageSquare, 
  FileText, 
  Utensils, 
  BookOpen,
  TrendingUp,
  Heart
} from "lucide-react";

const DashboardQuickActions = () => {
  const quickActions = [
    {
      title: "Аналитика здоровья",
      description: "Получите персонализированную аналитику ваших биомаркеров, тенденций здоровья и рекомендаций на основе загруженных анализов",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/analytics"
    },
    {
      title: "Профиль здоровья",
      description: "Создайте детальный профиль с информацией о вашем образе жизни, хронических заболеваниях и целях здоровья",
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/health-profile"
    },
    {
      title: "Доктор EVERLIV",
      description: "Персональный ИИ-консультант, обученный на медицинских данных для ответов на вопросы о здоровье и самочувствии",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/ai-doctor"
    },
    {
      title: "Анализ крови",
      description: "Загрузите результаты анализов крови для получения интерпретации биомаркеров и рекомендаций по улучшению показателей",
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/lab-analyses"
    },
    {
      title: "Дневник питания",
      description: "Отслеживайте калории, макронутриенты и получайте персональные рекомендации по питанию на основе ваших целей",
      icon: Utensils,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/nutrition-diary"
    },
    {
      title: "База Знаний",
      description: "Научные статьи, медицинские исследования и экспертные материалы по вопросам здоровья и долголетия",
      icon: BookOpen,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      href: "/medical-knowledge"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quickActions.map((action, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <CardTitle className="text-lg font-medium">{action.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{action.description}</p>
            <Link to={action.href}>
              <Button className="w-full" size="sm">
                Перейти
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
