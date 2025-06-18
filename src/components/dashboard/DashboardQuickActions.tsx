
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Activity, 
  Brain, 
  FileText, 
  Calendar, 
  Users, 
  BarChart3, 
  Heart,
  TrendingUp
} from "lucide-react";

const DashboardQuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Анализ крови",
      description: "Загрузите и интерпретируйте результаты анализов с помощью ИИ",
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      action: () => navigate("/blood-analysis"),
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      badge: null
    },
    {
      title: "Здоровье",
      description: "Отслеживайте жизненные показатели и выполняйте задачи здоровья",
      icon: <Heart className="h-8 w-8 text-red-600" />,
      action: () => navigate("/dashboard?tab=health"),
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      badge: <Badge variant="secondary" className="bg-red-100 text-red-700">Новое</Badge>
    },
    {
      title: "ИИ Ассистент",
      description: "Получите персональные рекомендации от нашего ИИ-помощника",
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      action: () => navigate("/dashboard?tab=ai"),
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      badge: null
    },
    {
      title: "ИИ-доктор",
      description: "Консультация с персональным ИИ-доктором",
      icon: <Activity className="h-8 w-8 text-green-600" />,
      action: () => navigate("/dashboard?tab=doctor"),
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      badge: null
    },
    {
      title: "Аналитика",
      description: "Комплексный анализ здоровья и персональные рекомендации",
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      action: () => navigate("/analytics"),
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      badge: null
    },
    {
      title: "Профиль здоровья",
      description: "Управляйте своим профилем и медицинской историей",
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      action: () => navigate("/health-profile"),
      color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
      badge: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quickActions.map((action, index) => (
        <Card 
          key={index} 
          className={`${action.color} transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg`}
          onClick={action.action}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {action.icon}
                <div>
                  <CardTitle className="text-lg text-gray-900">{action.title}</CardTitle>
                </div>
              </div>
              {action.badge}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-gray-600 mb-4">
              {action.description}
            </CardDescription>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-white/60 hover:bg-white/80"
              onClick={(e) => {
                e.stopPropagation();
                action.action();
              }}
            >
              Перейти
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
