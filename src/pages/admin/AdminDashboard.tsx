import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, BarChart2, Database, Settings } from "lucide-react";
import { useAdminApi } from "@/hooks/useAdminApi";

const AdminDashboard = () => {
  const { fetchData, loading, error } = useAdminApi();
  
  useEffect(() => {
    const loadDashboardData = async () => {
      const data = await fetchData('/api/admin/dashboard');
      if (data) {
        // Process dashboard data
        console.log('Dashboard data loaded with cache busting');
      }
    };
    
    loadDashboardData();
  }, [fetchData]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow pt-16">
        <div className="bg-white border-b border-gray-200 my-[20px]">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Панель администратора</h1>
            <div className="flex gap-2">
              <Link to="/profile">
                <Button variant="outline">Назад к профилю</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,254</div>
                <p className="text-xs text-muted-foreground">+15% с прошлого месяца</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Новые регистрации</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">За последние 7 дней</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Статьи в блоге</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">27</div>
                <p className="text-xs text-muted-foreground">3 опубликовано за последний месяц</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные подписки</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">518</div>
                <p className="text-xs text-muted-foreground">+8% с прошлого месяца</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Разделы панели управления</CardTitle>
                <CardDescription>Управляйте контентом и данными вашего сайта</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/blog" className="w-full">
                  <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="font-medium">Блог и статьи</span>
                    <span className="text-xs text-muted-foreground">Управление публикациями в блоге</span>
                  </Button>
                </Link>
                <Link to="/admin/users" className="w-full">
                  <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                    <Users className="h-6 w-6" />
                    <span className="font-medium">Пользователи</span>
                    <span className="text-xs text-muted-foreground">Управление аккаунтами пользователей</span>
                  </Button>
                </Link>
                <Link to="/admin/pricing" className="w-full">
                  <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                    <Database className="h-6 w-6" />
                    <span className="font-medium">Тарифы и услуги</span>
                    <span className="text-xs text-muted-foreground">Настройка цен и услуг</span>
                  </Button>
                </Link>
                <Link to="/admin/statistics" className="w-full">
                  <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                    <BarChart2 className="h-6 w-6" />
                    <span className="font-medium">Статистика</span>
                    <span className="text-xs text-muted-foreground">Аналитика и отчеты</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="blog">
              <TabsList className="mb-4">
                <TabsTrigger value="blog">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Последние публикации</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="users">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Новые пользователи</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="blog" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Новые методы холодовой терапии</h3>
                            <p className="text-sm text-muted-foreground">Опубликовано: 10.05.2025</p>
                          </div>
                          <Link to="/admin/blog">
                            <Button variant="outline" size="sm">Редактировать</Button>
                          </Link>
                        </div>
                      </div>
                      <div className="border-b pb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">ИИ в персонализации здоровья</h3>
                            <p className="text-sm text-muted-foreground">Опубликовано: 05.05.2025</p>
                          </div>
                          <Link to="/admin/blog">
                            <Button variant="outline" size="sm">Редактировать</Button>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Новые исследования в области долголетия</h3>
                            <p className="text-sm text-muted-foreground">Опубликовано: 01.05.2025</p>
                          </div>
                          <Link to="/admin/blog">
                            <Button variant="outline" size="sm">Редактировать</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Иванов Иван</h3>
                            <p className="text-sm text-muted-foreground">Регистрация: 13.05.2025</p>
                          </div>
                          <Link to="/admin/users">
                            <Button variant="outline" size="sm">Подробнее</Button>
                          </Link>
                        </div>
                      </div>
                      <div className="border-b pb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Петрова Анна</h3>
                            <p className="text-sm text-muted-foreground">Регистрация: 12.05.2025</p>
                          </div>
                          <Link to="/admin/users">
                            <Button variant="outline" size="sm">Подробнее</Button>
                          </Link>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Сидоров Алексей</h3>
                            <p className="text-sm text-muted-foreground">Регистрация: 11.05.2025</p>
                          </div>
                          <Link to="/admin/users">
                            <Button variant="outline" size="sm">Подробнее</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
