
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCheck, 
  Search, 
  Filter, 
  BarChart3, 
  Users,
  Activity,
  Shield,
  Download,
  Upload,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const HealthProfilesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stats = [
    { label: "Всего профилей", value: "2,847", icon: Users, color: "text-blue-600" },
    { label: "Активных", value: "2,234", icon: Activity, color: "text-green-600" },
    { label: "Требуют обновления", value: "145", icon: AlertCircle, color: "text-orange-600" },
    { label: "Полных профилей", value: "1,987", icon: CheckCircle, color: "text-purple-600" }
  ];

  const profiles = [
    {
      id: "1",
      name: "Иван Петров",
      age: 34,
      gender: "М",
      completeness: 95,
      lastUpdate: "2 дня назад",
      status: "complete",
      riskLevel: "low"
    },
    {
      id: "2",
      name: "Мария Сидорова",
      age: 29,
      gender: "Ж",
      completeness: 78,
      lastUpdate: "1 неделю назад",
      status: "incomplete",
      riskLevel: "medium"
    },
    {
      id: "3",
      name: "Алексей Козлов",
      age: 45,
      gender: "М",
      completeness: 100,
      lastUpdate: "1 день назад",
      status: "complete",
      riskLevel: "high"
    }
  ];

  const integrations = [
    { name: "Apple Health", status: "connected", users: 847 },
    { name: "Google Fit", status: "connected", users: 1234 },
    { name: "Fitbit", status: "connected", users: 567 },
    { name: "Samsung Health", status: "pending", users: 234 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Профили здоровья</h1>
        <p className="text-gray-600 mt-2">
          Управление медицинскими данными пользователей и настройками приватности
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

      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Профили
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Аналитика
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Интеграции
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Приватность
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск профилей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-sm text-gray-600">
                          {profile.age} лет, {profile.gender} • Обновлен {profile.lastUpdate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Заполнено {profile.completeness}%</p>
                        <Badge 
                          variant={profile.riskLevel === "low" ? "default" : 
                                  profile.riskLevel === "medium" ? "secondary" : "destructive"}
                        >
                          {profile.riskLevel === "low" ? "Низкий риск" :
                           profile.riskLevel === "medium" ? "Средний риск" : "Высокий риск"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамика здоровья</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Графики показателей здоровья</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Сравнительный анализ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Сравнение между группами пользователей</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Интеграции с устройствами</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-gray-600">{integration.users} пользователей</p>
                      </div>
                    </div>
                    <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                      {integration.status === "connected" ? "Подключено" : "Ожидание"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки приватности</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Управление доступом к данным</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Настройте уровни доступа для различных типов медицинских данных
                </p>
                <Button size="sm" className="mt-3">Настроить доступ</Button>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Аудит действий</h4>
                <p className="text-green-700 text-sm mt-1">
                  Просмотр истории изменений и доступа к данным пациентов
                </p>
                <Button size="sm" className="mt-3">Посмотреть логи</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthProfilesManagement;
