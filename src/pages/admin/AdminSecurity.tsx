
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Key, Eye, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSecurity = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Вернуться в панель управления
              </Button>
            </Link>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Безопасность системы</h1>
              <p className="text-gray-600 mt-2">Мониторинг и настройки безопасности платформы</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Статус безопасности
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>SSL сертификат</span>
                      <span className="text-green-600 font-medium">Активен</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Заголовки безопасности</span>
                      <span className="text-green-600 font-medium">Настроены</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ограничение запросов</span>
                      <span className="text-green-600 font-medium">Активно</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Валидация входных данных</span>
                      <span className="text-green-600 font-medium">Включена</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-500" />
                    Мониторинг активности
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Попытки входа за 24ч</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Заблокированные IP</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Подозрительная активность</span>
                      <span className="text-yellow-600 font-medium">3 события</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API запросы за час</span>
                      <span className="font-medium">45,678</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-purple-500" />
                    Управление ключами
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>OpenAI API</span>
                      <span className="text-green-600 font-medium">Безопасно</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Supabase</span>
                      <span className="text-green-600 font-medium">Безопасно</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>PayKeeper</span>
                      <span className="text-green-600 font-medium">Безопасно</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Ротация ключей
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Журнал угроз
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-l-4 border-yellow-400 pl-3">
                      <p className="text-sm font-medium">Превышение лимита запросов</p>
                      <p className="text-xs text-gray-500">IP: 192.168.1.100 - 2 мин назад</p>
                    </div>
                    <div className="border-l-4 border-red-400 pl-3">
                      <p className="text-sm font-medium">Попытка SQL инъекции</p>
                      <p className="text-xs text-gray-500">IP: 10.0.1.50 - 15 мин назад</p>
                    </div>
                    <div className="border-l-4 border-orange-400 pl-3">
                      <p className="text-sm font-medium">Подозрительный паттерн входа</p>
                      <p className="text-xs text-gray-500">Пользователь: user@*** - 1 час назад</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminSecurity;
