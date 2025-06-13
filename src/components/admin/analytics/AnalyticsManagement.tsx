
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";

const AnalyticsManagement = () => {
  const platformMetrics = [
    { label: "Активные пользователи", value: "2,847", change: "+12.3%", icon: Users },
    { label: "Время ответа ИИ", value: "1.2с", change: "-5.2%", icon: Activity },
    { label: "Успешность рекомендаций", value: "87%", change: "+8.1%", icon: TrendingUp },
    { label: "Общая эффективность", value: "94%", change: "+3.4%", icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Аналитика платформы</h1>
        <p className="text-gray-600 mt-2">
          Детальная аналитика эффективности работы платформы и сервисов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {platformMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-green-600">{metric.change}</p>
                </div>
                <metric.icon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Детальная аналитика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <p>Здесь будут размещены детальные графики и метрики</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsManagement;
