
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Utensils, 
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const AdminOverview = () => {
  const stats = [
    {
      title: "Активные пользователи",
      value: "2,847",
      change: "+12.3%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "ИИ консультации",
      value: "1,423",
      change: "+8.7%",
      icon: MessageSquare,
      color: "text-green-600"
    },
    {
      title: "Планы здоровья",
      value: "987",
      change: "+15.2%",
      icon: Heart,
      color: "text-red-600"
    },
    {
      title: "Записи питания",
      value: "5,234",
      change: "+22.1%",
      icon: Utensils,
      color: "text-orange-600"
    }
  ];

  const systemStatus = [
    { name: "ИИ модель", status: "active", uptime: "99.9%" },
    { name: "База данных", status: "active", uptime: "100%" },
    { name: "API сервисы", status: "warning", uptime: "98.2%" },
    { name: "Мониторинг", status: "active", uptime: "99.8%" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Обзор платформы</h1>
        <p className="text-gray-600 mt-2">
          Основные метрики и состояние системы ИИ доктора
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Состояние системы */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Состояние системы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {service.status === "active" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Uptime: {service.uptime}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Последняя активность */}
        <Card>
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Новый пользователь зарегистрирован</p>
                  <p className="text-xs text-gray-500">2 минуты назад</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">ИИ консультация завершена</p>
                  <p className="text-xs text-gray-500">5 минут назад</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Обновлен план питания</p>
                  <p className="text-xs text-gray-500">12 минут назад</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
