
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageManagement from "@/components/editor/PageManagement";
import BlogManagement from "@/components/blog/BlogManagement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, TestTube, Clock, Brain, User, Calendar, Activity } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES } from "@/constants/subscription-features";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("pages");
  const {
    subscription,
    isLoading,
    canUseFeature
  } = useSubscription();
  
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="bg-white border-b border-gray-200 my-[20px]">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex gap-2">
              <Link to="/my-protocols">
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Мои протоколы
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Мой профиль
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Вернуться на главную
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          {/* Subscription Status Banner */}
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-everliv-600" />
                <div>
                  <h2 className="font-medium">Состояние подписки</h2>
                  {isLoading ? <Skeleton className="h-5 w-32 mt-1" /> : subscription ? <div className="flex items-center mt-1">
                      <span className={`text-sm ${subscription.status === 'active' ? 'text-evergreen-600' : 'text-yellow-600'}`}>
                        {subscription.plan_type === 'basic' ? 'Базовый' : subscription.plan_type === 'standard' ? 'Стандарт' : 'Премиум'} 
                        ({subscription.status === 'active' ? 'Активна' : 'Отменена'})
                      </span>
                    </div> : <span className="text-sm text-gray-500 mt-1">Нет активной подписки</span>}
                </div>
              </div>
              <Link to="/dashboard/subscription">
                <Button>
                  {subscription ? 'Управление подпиской' : 'Оформить подписку'}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* AI Health Features */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">AI Функции для здоровья</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <TestTube className="h-8 w-8 text-everliv-600 shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Анализ крови с AI</h3>
                      <p className="text-gray-500 mb-4 text-sm">
                        Получите расшифровку анализа крови и персонализированные рекомендации
                      </p>
                      <Link to="/blood-analysis">
                        <Button 
                          variant="outline"
                          className="w-full"
                          disabled={!canUseFeature(FEATURES.BLOOD_ANALYSIS)}
                        >
                          {canUseFeature(FEATURES.BLOOD_ANALYSIS) ? 'Перейти' : 'Требуется подписка'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Clock className="h-8 w-8 text-everliv-600 shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Биологический возраст</h3>
                      <p className="text-gray-500 mb-4 text-sm">
                        Определите свой биологический возраст и получите рекомендации
                      </p>
                      <Link to="/biological-age">
                        <Button 
                          variant="outline"
                          className="w-full"
                          disabled={!canUseFeature(FEATURES.BIOLOGICAL_AGE_TEST)}
                        >
                          {canUseFeature(FEATURES.BIOLOGICAL_AGE_TEST) ? 'Перейти' : 'Требуется подписка'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Brain className="h-8 w-8 text-everliv-600 shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium mb-2">AI анализ здоровья</h3>
                      <p className="text-gray-500 mb-4 text-sm">
                        Получите комплексную оценку здоровья на основе всех ваших данных
                      </p>
                      <Link to="/comprehensive-analysis">
                        <Button 
                          variant="outline"
                          className="w-full"
                          disabled={!canUseFeature(FEATURES.COMPREHENSIVE_AI_ANALYSIS)}
                        >
                          {canUseFeature(FEATURES.COMPREHENSIVE_AI_ANALYSIS) ? 'Перейти' : 'Требуется подписка'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-8 w-8 text-everliv-600 shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Мои протоколы</h3>
                      <p className="text-gray-500 mb-4 text-sm">
                        Персональные протоколы здоровья и отслеживание прогресса
                      </p>
                      <Link to="/my-protocols">
                        <Button 
                          variant="outline"
                          className="w-full"
                        >
                          Перейти
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Activity className="h-8 w-8 text-everliv-600 shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Отслеживание протоколов</h3>
                      <p className="text-gray-500 mb-4 text-sm">
                        Отслеживайте прогресс ваших протоколов и анализируйте результаты
                      </p>
                      <Link to="/my-protocols">
                        <Button 
                          variant="outline"
                          className="w-full"
                        >
                          Перейти к отслеживанию
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pages" className="mt-0">
              <PageManagement />
            </TabsContent>
            
            <TabsContent value="blog" className="mt-0">
              <BlogManagement />
            </TabsContent>
            
            <TabsContent value="media" className="mt-0">
              <div className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="text-lg font-medium mb-4">Media Library</h2>
                <p className="text-gray-500">Media library functionality will be implemented soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>;
};

export default Dashboard;
