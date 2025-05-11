import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Activity, Calendar, User, ArrowLeft, Printer, LineChart, BookOpen, Stethoscope, FileBarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionBanner from "@/components/dashboard/SubscriptionBanner";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data for demonstration
  const patientData = {
    name: user?.user_metadata?.full_name || "Пользователь",
    id: user?.id?.substring(0, 8) || "ID12345",
    lastCheckup: "15 мая 2025",
    vitalSigns: {
      weight: "75 кг",
      height: "177 см",
      bmi: "23.9",
      bloodPressure: "120/80",
      heartRate: "72 уд/мин",
    },
    upcomingAppointments: [
      { date: "25 мая 2025", type: "Анализ крови", status: "Запланировано" },
      { date: "28 мая 2025", type: "Консультация", status: "Подтверждено" },
    ],
    recentProtocols: [
      { name: "Базовый протокол здоровья", progress: 65, days: "День 14 из 30" },
      { name: "Холодовая терапия", progress: 30, days: "День 3 из 14" },
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-grow pt-16">
        {/* Patient Info Header */}
        <div className="bg-white border-b border-gray-200 my-[20px]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <User className="text-blue-600 h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{patientData.name}</h1>
                  <p className="text-gray-500">ID: {patientData.id} • Последний визит: {patientData.lastCheckup}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Печать
                </Button>
                <Link to="/">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Вернуться на главную
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Subscription Status Banner */}
          <SubscriptionBanner />

          {/* Main Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="bg-white border border-gray-200 p-1 rounded-md">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Activity className="h-4 w-4 mr-2" />
                Обзор
              </TabsTrigger>
              <TabsTrigger value="protocols" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Протоколы
              </TabsTrigger>
              <TabsTrigger value="medical" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Stethoscope className="h-4 w-4 mr-2" />
                Медицинские данные
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <LineChart className="h-4 w-4 mr-2" />
                Аналитика
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vital Signs Card */}
                <Card>
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600" />
                      Показатели
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Вес</span>
                        <span className="font-medium">{patientData.vitalSigns.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Рост</span>
                        <span className="font-medium">{patientData.vitalSigns.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">ИМТ</span>
                        <span className="font-medium">{patientData.vitalSigns.bmi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Артериальное давление</span>
                        <span className="font-medium">{patientData.vitalSigns.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Пульс</span>
                        <span className="font-medium">{patientData.vitalSigns.heartRate}</span>
                      </div>
                    </div>
                    <div className="mt-4 text-right">
                      <Button variant="link" size="sm" className="text-blue-600">
                        Показать всю историю
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Protocols Progress */}
                <Card>
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                      Мои протоколы
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {patientData.recentProtocols.map((protocol, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{protocol.name}</span>
                            <span className="text-blue-600">{protocol.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${protocol.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">{protocol.days}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Link to="/my-protocols">
                        <Button variant="outline" size="sm">
                          Все протоколы
                        </Button>
                      </Link>
                      <Link to="/protocol-tracking">
                        <Button size="sm">
                          Отслеживание
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Appointments Card */}
                <Card>
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                      Предстоящие визиты
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {patientData.upcomingAppointments.map((appointment, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-medium">{appointment.type}</span>
                            <span className={
                              appointment.status === "Подтверждено" 
                                ? "text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full" 
                                : "text-yellow-600 text-xs bg-yellow-50 px-2 py-0.5 rounded-full"
                            }>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{appointment.date}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <Button variant="link" size="sm" className="text-blue-600">
                        Управление визитами
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis History */}
                <Card>
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-lg flex items-center">
                      <FileBarChart className="h-5 w-5 mr-2 text-blue-600" />
                      История анализов
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <p>У вас пока нет загруженных анализов</p>
                      <Button size="sm" className="mt-4">
                        Загрузить результаты
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card>
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                      Рекомендации AI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="font-medium">Пройдите оценку биологического возраста</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Получите персонализированные рекомендации для улучшения здоровья
                        </div>
                        <Link to="/biological-age">
                          <Button size="sm" className="mt-2 w-full">
                            Начать
                          </Button>
                        </Link>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                        <div className="font-medium">Расшифровка анализа крови</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Загрузите результаты для AI-анализа и получения рекомендаций
                        </div>
                        <Link to="/blood-analysis">
                          <Button size="sm" variant="outline" className="mt-2 w-full">
                            Перейти
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600" />
                      Быстрые действия
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/my-protocols">
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          Мои протоколы
                        </Button>
                      </Link>
                      <Link to="/profile">
                        <Button variant="outline" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Мой профиль
                        </Button>
                      </Link>
                      <Link to="/blood-analysis">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Анализ крови
                        </Button>
                      </Link>
                      <Link to="/comprehensive-analysis">
                        <Button variant="outline" className="w-full justify-start">
                          <Activity className="h-4 w-4 mr-2" />
                          Оценка здоровья
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="protocols" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Мои протоколы здоровья</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">Здесь будут отображаться ваши протоколы здоровья</p>
                  <Link to="/my-protocols">
                    <Button>
                      Перейти к протоколам
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Медицинские данные</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">Здесь будут отображаться ваши медицинские данные и история</p>
                  <Button variant="outline">
                    Загрузить данные
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Аналитика здоровья</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">Здесь будет отображаться аналити��а вашего здоровья</p>
                  <Link to="/comprehensive-analysis">
                    <Button>
                      Перейти к аналитике
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
