import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, X, Calendar, User, Settings } from "lucide-react";

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      title: "Новая рекомендация по здоровью",
      message: "Основываясь на ваших последних метриках, мы подготовили персональные рекомендации",
      time: "5 мин назад",
      read: false,
      type: "health"
    },
    {
      id: 2,
      title: "Время записать дневные показатели",
      message: "Не забудьте внести сегодняшние данные о здоровье",
      time: "2 часа назад",
      read: false,
      type: "reminder"
    },
    {
      id: 3,
      title: "Обновление профиля завершено",
      message: "Ваш профиль здоровья успешно обновлен",
      time: "1 день назад",
      read: true,
      type: "system"
    },
    {
      id: 4,
      title: "Еженедельный отчет готов",
      message: "Посмотрите ваш прогресс за последнюю неделю",
      time: "3 дня назад",
      read: true,
      type: "report"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <Bell className="h-4 w-4 text-green-600" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'system':
        return <Settings className="h-4 w-4 text-blue-600" />;
      case 'report':
        return <User className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Уведомления</h1>
          <Button variant="outline" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Отметить все как прочитанные
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`transition-colors ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Нет новых уведомлений</h3>
              <p className="text-muted-foreground">
                Здесь будут отображаться важные обновления и напоминания
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;