
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Plus, 
  Settings, 
  BarChart3, 
  Users,
  Activity,
  Target,
  Bell,
  FileText,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const HealthRecommendationsManagement = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const stats = [
    { label: "Активных планов", value: "1,234", icon: Activity, color: "text-blue-600" },
    { label: "Завершенных", value: "567", icon: CheckCircle, color: "text-green-600" },
    { label: "Требуют внимания", value: "23", icon: AlertTriangle, color: "text-orange-600" },
    { label: "Средняя эффективность", value: "87%", icon: Target, color: "text-purple-600" }
  ];

  const templates = [
    {
      id: "weight-loss",
      name: "Снижение веса",
      description: "Комплексный план для безопасного снижения веса",
      category: "Питание",
      usage: 324
    },
    {
      id: "diabetes-control",
      name: "Контроль диабета",
      description: "Управление уровнем сахара в крови",
      category: "Хронические заболевания",
      usage: 156
    },
    {
      id: "cardio-health",
      name: "Здоровье сердца",
      description: "Профилактика сердечно-сосудистых заболеваний",
      category: "Профилактика",
      usage: 234
    }
  ];

  const activeRecommendations = [
    {
      user: "Иван П.",
      plan: "Снижение веса",
      progress: 65,
      status: "active",
      lastUpdate: "2 часа назад"
    },
    {
      user: "Мария С.",
      plan: "Контроль диабета",
      progress: 89,
      status: "attention",
      lastUpdate: "1 день назад"
    },
    {
      user: "Алексей К.",
      plan: "Здоровье сердца",
      progress: 45,
      status: "active",
      lastUpdate: "3 часа назад"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Рекомендации здоровья</h1>
        <p className="text-gray-600 mt-2">
          Управление планами лечения и профилактики на основе ИИ
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Активные планы
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Шаблоны
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Аналитика
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Уведомления
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Активные планы пользователей</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Новый план
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {activeRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{rec.user}</p>
                        <p className="text-sm text-gray-600">{rec.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{rec.progress}%</p>
                        <p className="text-xs text-gray-500">{rec.lastUpdate}</p>
                      </div>
                      <Badge variant={rec.status === "active" ? "default" : "destructive"}>
                        {rec.status === "active" ? "Активный" : "Требует внимания"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Шаблоны рекомендаций</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Создать шаблон
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary">{template.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Использований: {template.usage}</span>
                    <Button size="sm" variant="outline">Редактировать</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Эффективность рекомендаций</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Графики эффективности рекомендаций</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройка уведомлений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Уведомления о приеме лекарств</label>
                <Input placeholder="Время напоминания" />
              </div>
              <div>
                <label className="text-sm font-medium">Напоминания о диете</label>
                <Input placeholder="Частота напоминаний" />
              </div>
              <div>
                <label className="text-sm font-medium">Уведомления об упражнениях</label>
                <Input placeholder="Расписание тренировок" />
              </div>
              <Button>Сохранить настройки</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthRecommendationsManagement;
