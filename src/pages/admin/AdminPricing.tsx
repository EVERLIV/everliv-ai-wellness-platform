
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2, Plus, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { 
  SubscriptionPlan,
  fetchSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
} from "@/services/admin-service";
import { toast } from "sonner";
import PlanEditor from "@/components/admin/PlanEditor";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const AdminPricing = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  
  // Состояния для редактирования тарифа
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  
  // Состояния для удаления тарифа
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSubscriptionPlans();
      setPlans(data);
    } catch (error) {
      console.error("Error loading subscription plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setCurrentPlan(plan);
    setIsCreateMode(false);
    setIsEditDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setCurrentPlan(null);
    setIsCreateMode(true);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    
    try {
      const success = await deleteSubscriptionPlan(planToDelete.id);
      if (success) {
        setPlans(plans.filter(p => p.id !== planToDelete.id));
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleSavePlan = async (planData: Partial<SubscriptionPlan>) => {
    try {
      if (isCreateMode) {
        const newPlan = await createSubscriptionPlan(planData as Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>);
        if (newPlan) {
          setPlans([...plans, newPlan]);
        }
      } else if (currentPlan) {
        const success = await updateSubscriptionPlan(currentPlan.id, planData);
        if (success) {
          setPlans(plans.map(p => p.id === currentPlan.id ? { ...p, ...planData } : p));
        }
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 pt-24">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-8 w-64 mb-6" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 pt-24">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">У вас нет доступа к этой странице</h1>
            <p className="mb-6">Для доступа требуются права администратора</p>
            <Link to="/dashboard">
              <Button>Вернуться в панель управления</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <Button onClick={handleCreatePlan}>
              <Plus className="h-4 w-4 mr-1" />
              Создать новый тариф
            </Button>
          </div>
          
          <div className="mb-8">
            <Tabs defaultValue="subscriptions">
              <TabsList className="mb-4">
                <TabsTrigger value="subscriptions">Подписки</TabsTrigger>
                <TabsTrigger value="services">Отдельные услуги</TabsTrigger>
                <TabsTrigger value="promotions">Акции и скидки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscriptions">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                  </div>
                ) : plans.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Нет доступных тарифов</h3>
                      <p className="text-gray-500 mb-4">
                        Создайте тарифы для отображения доступных подписок пользователям
                      </p>
                      <Button onClick={handleCreatePlan}>
                        <Plus className="h-4 w-4 mr-1" />
                        Создать тариф
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <Card 
                        key={plan.id} 
                        className={`relative ${plan.is_popular ? 'border-everliv-600 ring-2 ring-everliv-600/20' : ''}`}
                      >
                        {plan.is_popular && (
                          <div className="bg-everliv-600 text-white text-xs font-semibold px-3 py-1 absolute right-0 top-0 rounded-bl">
                            Популярный выбор
                          </div>
                        )}
                        {!plan.is_active && (
                          <div className="bg-gray-500 text-white text-xs font-semibold px-3 py-1 absolute left-0 top-0 rounded-br">
                            Неактивен
                          </div>
                        )}
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-center">
                            <CardTitle>{plan.name}</CardTitle>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditPlan(plan)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClick(plan)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-3xl font-bold">
                              {plan.price.toLocaleString()} ₽
                              <span className="text-sm font-normal text-muted-foreground"> / месяц</span>
                            </div>
                            <div className="text-sm text-gray-500">{plan.description}</div>
                            <div className="space-y-2 text-sm mt-4">
                              {plan.features && plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                  <div className="flex-1">{feature.name}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="services">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <h3 className="font-medium mb-2">Управление услугами</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Функциональность управления отдельными услугами находится в разработке
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="promotions">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <h3 className="font-medium mb-2">Управление акциями и скидками</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Функциональность управления акциями и скидками находится в разработке
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />

      {/* Диалог редактирования тарифа */}
      <PlanEditor
        plan={currentPlan}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSavePlan}
        isNew={isCreateMode}
      />

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить тариф?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить тариф "{planToDelete?.name}"? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPricing;
