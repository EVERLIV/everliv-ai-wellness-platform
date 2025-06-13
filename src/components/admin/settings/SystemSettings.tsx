
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings, Database, Shield, Bell } from "lucide-react";

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Системные настройки</h1>
        <p className="text-gray-600 mt-2">Конфигурация платформы и системных параметров</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Общие настройки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Название платформы</label>
              <Input defaultValue="ИИ Доктор EVERLIV" />
            </div>
            <div>
              <label className="text-sm font-medium">Максимальное время сессии (минуты)</label>
              <Input type="number" defaultValue="60" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Режим обслуживания</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              База данных
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Автоматическое резервное копирование</span>
              <Switch defaultChecked />
            </div>
            <div>
              <label className="text-sm font-medium">Интервал резервного копирования (часы)</label>
              <Input type="number" defaultValue="24" />
            </div>
            <Button>Создать резервную копию сейчас</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Двухфакторная аутентификация</span>
              <Switch defaultChecked />
            </div>
            <div>
              <label className="text-sm font-medium">Максимальное количество попыток входа</label>
              <Input type="number" defaultValue="5" />
            </div>
            <div>
              <label className="text-sm font-medium">Время блокировки после превышения попыток (минуты)</label>
              <Input type="number" defaultValue="15" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email уведомления</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Push уведомления</span>
              <Switch defaultChecked />
            </div>
            <div>
              <label className="text-sm font-medium">Email для системных уведомлений</label>
              <Input type="email" placeholder="admin@everliv.ru" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Отменить</Button>
        <Button>Сохранить настройки</Button>
      </div>
    </div>
  );
};

export default SystemSettings;
