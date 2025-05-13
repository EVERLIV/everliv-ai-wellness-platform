
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminPricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="w-4 h-4" />
                  Вернуться в панель управления
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Управление тарифами и услугами</h1>
            </div>
            <Button>Создать новый тариф</Button>
          </div>
          
          <div className="mb-8">
            <Tabs defaultValue="subscriptions">
              <TabsList className="mb-4">
                <TabsTrigger value="subscriptions">Подписки</TabsTrigger>
                <TabsTrigger value="services">Отдельные услуги</TabsTrigger>
                <TabsTrigger value="promotions">Акции и скидки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscriptions">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Subscription Plan Cards */}
                  {['Базовый', 'Стандартный', 'Премиум'].map((plan, index) => (
                    <Card key={index} className={index === 2 ? 'border-primary' : ''}>
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-center">
                          <CardTitle>{plan}</CardTitle>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-3xl font-bold">
                            {index === 0 ? '2 900 ₽' : index === 1 ? '4 900 ₽' : '7 900 ₽'}
                            <span className="text-sm font-normal text-muted-foreground"> / месяц</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                              {index >= 0 && <div>Базовый анализ состояния здоровья</div>}
                            </div>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                              {index >= 0 && <div>Доступ к образовательным материалам</div>}
                            </div>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${index >= 1 ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                              <div className={index < 1 ? 'text-muted-foreground' : ''}>Анализ биомаркеров крови</div>
                            </div>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${index >= 1 ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                              <div className={index < 1 ? 'text-muted-foreground' : ''}>Персональные рекомендации</div>
                            </div>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${index >= 2 ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                              <div className={index < 2 ? 'text-muted-foreground' : ''}>Консультации специалистов</div>
                            </div>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${index >= 2 ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                              <div className={index < 2 ? 'text-muted-foreground' : ''}>Индивидуальные протоколы</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="services">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b">
                        <div className="space-y-1">
                          <h3 className="font-medium">Анализ биомаркеров крови</h3>
                          <p className="text-sm text-muted-foreground">Полный анализ и интерпретация результатов</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-semibold">5 500 ₽</div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b">
                        <div className="space-y-1">
                          <h3 className="font-medium">Расчет биологического возраста</h3>
                          <p className="text-sm text-muted-foreground">Определение биологического возраста по параметрам организма</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-semibold">3 900 ₽</div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b">
                        <div className="space-y-1">
                          <h3 className="font-medium">Консультация специалиста</h3>
                          <p className="text-sm text-muted-foreground">Персональная онлайн-консультация с экспертом</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-semibold">4 500 ₽</div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="font-medium">Создание персонализированного протокола</h3>
                          <p className="text-sm text-muted-foreground">Разработка индивидуальной программы здоровья</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-semibold">8 900 ₽</div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="promotions">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="border-b pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                          <div>
                            <Label htmlFor="promo-name">Название акции</Label>
                            <Input id="promo-name" defaultValue="Весенняя скидка" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="promo-code">Промокод</Label>
                            <Input id="promo-code" defaultValue="SPRING2025" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="promo-discount">Размер скидки</Label>
                            <Input id="promo-discount" defaultValue="15%" className="mt-1" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="promo-start">Дата начала</Label>
                            <Input id="promo-start" type="date" defaultValue="2025-03-01" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="promo-end">Дата окончания</Label>
                            <Input id="promo-end" type="date" defaultValue="2025-05-31" className="mt-1" />
                          </div>
                          <div className="flex items-end">
                            <Button className="w-full">Сохранить изменения</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b">
                          <div className="space-y-1">
                            <h3 className="font-medium">Новогодняя скидка</h3>
                            <p className="text-sm text-muted-foreground">Промокод: NEWYEAR2025 (-20%)</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">01.12.2025 - 15.01.2026</div>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pb-4 border-b">
                          <div className="space-y-1">
                            <h3 className="font-medium">Черная пятница</h3>
                            <p className="text-sm text-muted-foreground">Промокод: BLACKFRIDAY2025 (-30%)</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">25.11.2025 - 28.11.2025</div>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPricing;
