
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Database,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";

const AIChatManagement = () => {
  const [isTraining, setIsTraining] = useState(false);

  const chatStats = [
    { label: "Всего диалогов", value: "12,847" },
    { label: "Активных сессий", value: "234" },
    { label: "Средняя оценка", value: "4.8/5" },
    { label: "Время ответа", value: "1.2с" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Управление ИИ Чатом</h1>
        <p className="text-gray-600 mt-2">
          Настройка и мониторинг чат-бота для консультаций
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {chatStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Настройки
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Обучение
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Аналитика
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Имя ИИ ассистента</label>
                <Input defaultValue="ИИ Доктор EVERLIV" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Системный промпт</label>
                <Textarea 
                  placeholder="Вы - опытный медицинский ИИ ассистент..."
                  rows={4}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium">Температура модели</label>
                  <Input type="number" defaultValue="0.7" min="0" max="1" step="0.1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Максимум токенов</label>
                  <Input type="number" defaultValue="500" />
                </div>
              </div>

              <Button>Сохранить настройки</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Обучение модели</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Статус обучения</h3>
                  <p className="text-sm text-gray-600">
                    {isTraining ? "Модель обучается..." : "Модель готова к работе"}
                  </p>
                </div>
                <Badge variant={isTraining ? "secondary" : "default"}>
                  {isTraining ? "Обучение" : "Готово"}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsTraining(!isTraining)}
                  disabled={isTraining}
                >
                  {isTraining ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Остановить
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Начать обучение
                    </>
                  )}
                </Button>
                
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Обновить данные
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Аналитика диалогов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Графики аналитики будут здесь</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIChatManagement;
