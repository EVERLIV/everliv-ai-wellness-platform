import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  Calendar,
  Target,
  Heart,
  Brain
} from "lucide-react";

const DashboardPage = () => {
  const stats = [
    {
      title: "Общий балл здоровья",
      value: "85",
      unit: "/100",
      change: "+5%",
      icon: Heart,
      color: "text-green-600"
    },
    {
      title: "Активные цели",
      value: "4",
      unit: "цели",
      change: "+2",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Дней подряд",
      value: "12",
      unit: "дней",
      change: "+12",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "ИИ-консультации",
      value: "8",
      unit: "в месяц",
      change: "5 осталось",
      icon: Brain,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    { action: "Добавлены метрики здоровья", time: "2 часа назад" },
    { action: "Получена новая рекомендация", time: "4 часа назад" },
    { action: "Обновлен профиль здоровья", time: "1 день назад" },
    { action: "Достигнута цель по шагам", time: "2 дня назад" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Заголовок */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
          <p className="text-muted-foreground">
            Добро пожаловать! Вот обзор вашего здоровья и активности.
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span className="text-sm text-muted-foreground">{stat.unit}</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Основной контент */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Левая колонка */}
          <div className="lg:col-span-2 space-y-6">
            {/* График активности */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Активность за неделю
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">График активности будет здесь</p>
                </div>
              </CardContent>
            </Card>

            {/* Быстрые действия */}
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Activity className="h-6 w-6" />
                    <span className="text-xs">Метрики</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Brain className="h-6 w-6" />
                    <span className="text-xs">ИИ-Врач</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Target className="h-6 w-6" />
                    <span className="text-xs">Цели</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-xs">Отчеты</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка */}
          <div className="space-y-6">
            {/* Последняя активность */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Последняя активность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Рекомендации */}
            <Card>
              <CardHeader>
                <CardTitle>Рекомендации дня</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Увеличьте активность</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Вы прошли только 6,500 шагов. Попробуйте дойти до 10,000!
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Отличный сон!</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Вы спали 8 часов - это идеально для восстановления.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;