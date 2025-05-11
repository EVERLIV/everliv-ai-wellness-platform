
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageManagement from "@/components/editor/PageManagement";
import BlogManagement from "@/components/blog/BlogManagement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("pages");
  const { subscription, isLoading } = useSubscription();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Вернуться на главную
              </Button>
            </Link>
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
                  {isLoading ? (
                    <Skeleton className="h-5 w-32 mt-1" />
                  ) : subscription ? (
                    <div className="flex items-center mt-1">
                      <span className={`text-sm ${
                        subscription.status === 'active' 
                          ? 'text-evergreen-600' 
                          : 'text-yellow-600'
                      }`}>
                        {subscription.plan_type === 'basic' ? 'Базовый' : 
                         subscription.plan_type === 'standard' ? 'Стандарт' : 'Премиум'} 
                        ({subscription.status === 'active' ? 'Активна' : 'Отменена'})
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 mt-1">Нет активной подписки</span>
                  )}
                </div>
              </div>
              <Link to="/dashboard/subscription">
                <Button>
                  {subscription ? 'Управление подпиской' : 'Оформить подписку'}
                </Button>
              </Link>
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
    </div>
  );
};

export default Dashboard;
