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
  TrendingUp,
  BookOpen,
  Utensils,
  TestTube,
  Clock,
  Star
} from "lucide-react";

const DashboardQuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Профиль здоровья",
      description: "Создайте полный профиль здоровья с персональными данными, медицинской историей и результатами анализов",
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      action: () => navigate("/health-profile"),
      color: "bg-pink-50",
      badge: <Badge className="bg-green-600 text-white">Основа</Badge>,
      features: ["Медицинская история", "Лабораторные показатели", "Персонализация"]
    },
    {
      title: "Лабораторные анализы",
      description: "Загружайте и анализируйте результаты лабораторных исследований с помощью ИИ для получения персональных рекомендаций",
      icon: <TestTube className="h-8 w-8 text-blue-600" />,
      action: () => navigate("/lab-analyses"),
      color: "bg-blue-50",
      badge: <Badge className="bg-blue-600 text-white">ИИ-анализ</Badge>,
      features: ["Умный анализ", "Рекомендации", "Трекинг динамики"]
    },
    {
      title: "Мои биомаркеры",
      description: "Отслеживайте и анализируйте ваши биомаркеры для мониторинга состояния здоровья",
      icon: <Activity className="h-8 w-8 text-green-600" />,
      action: () => navigate("/my-biomarkers"),
      color: "bg-green-50",
      badge: <Badge className="bg-green-600 text-white">Трекинг</Badge>,
      features: ["Мониторинг", "Динамика", "Анализ трендов"]
    },
    {
      title: "Анализ и рекомендации",
      description: "Получайте комплексную аналитику здоровья на основе всех ваших данных с прогнозами и детальными рекомендациями",
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      action: () => navigate("/analytics"),
      color: "bg-purple-50",
      badge: <Badge className="bg-green-600 text-white">Премиум</Badge>,
      features: ["Глубокая аналитика", "Прогнозы", "Персональный план"]
    },
    {
      title: "ИИ-доктор",
      description: "Консультируйтесь с искусственным интеллектом по вопросам здоровья, получайте медицинские рекомендации 24/7",
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      action: () => navigate("/ai-doctor"),
      color: "bg-blue-50",
      badge: <Badge className="bg-blue-600 text-white">ИИ</Badge>,
      features: ["24/7 доступность", "Медицинская база", "Персональные ответы"]
    },
    {
      title: "База знаний",
      description: "Изучайте медицинскую информацию, статьи экспертов, научные исследования и расширяйте знания о здоровье",
      icon: <BookOpen className="h-8 w-8 text-orange-600" />,
      action: () => navigate("/medical-knowledge"),
      color: "bg-orange-50",
      badge: <Badge className="bg-green-600 text-white">Обучение</Badge>,
      features: ["Экспертные статьи", "Научные данные", "Образовательный контент"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quickActions.map((action, index) => (
        <Card 
          key={index} 
          className={`${action.color} border border-gray-200 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg relative`}
          onClick={action.action}
        >
          {action.badge && (
            <div className="absolute top-3 right-3">
              {action.badge}
            </div>
          )}
          
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3 mb-2">
              {action.icon}
              <CardTitle className="text-lg text-gray-900">{action.title}</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <CardDescription className="text-gray-600 mb-4 text-sm leading-relaxed">
              {action.description}
            </CardDescription>
            
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">ВОЗМОЖНОСТИ:</p>
              <div className="flex flex-wrap gap-1">
                {action.features.map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs bg-white/60 text-gray-700 px-2 py-1 rounded-full border border-gray-200"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
              onClick={(e) => {
                e.stopPropagation();
                action.action();
              }}
            >
              Перейти к функции
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
