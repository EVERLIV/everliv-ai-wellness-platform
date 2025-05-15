
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Edit, UserPlus, Mail, CreditCard, X, Calendar } from "lucide-react";
import { useAdminApi } from "@/hooks/useAdminApi";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { 
  AdminUser, 
  fetchAdminUsers, 
  updateUserProfile, 
  assignSubscriptionToUser,
  cancelUserSubscription,
  fetchSubscriptionPlans,
  SubscriptionPlan
} from "@/services/admin-service";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: ""
  });
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  
  // Новые состояния для управления подписками
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanType, setSelectedPlanType] = useState<string>("");
  const [subscriptionExpiryDate, setSubscriptionExpiryDate] = useState<string>("");
  const [processingSubscription, setProcessingSubscription] = useState(false);

  useEffect(() => {
    loadUsers();
    loadSubscriptionPlans();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        user => 
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Не удалось загрузить пользователей");
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSubscriptionPlans = async () => {
    try {
      const plans = await fetchSubscriptionPlans();
      setSubscriptionPlans(plans);
    } catch (error) {
      console.error("Error loading subscription plans:", error);
      toast.error("Не удалось загрузить тарифные планы");
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setCurrentUser(user);
    setEditForm({
      first_name: user.first_name || "",
      last_name: user.last_name || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!currentUser) return;

    const success = await updateUserProfile(currentUser.id, editForm);
    if (success) {
      setUsers(users.map(u => 
        u.id === currentUser.id 
          ? { ...u, first_name: editForm.first_name, last_name: editForm.last_name }
          : u
      ));
      setIsEditDialogOpen(false);
    }
  };

  const handleInviteUser = async () => {
    // В реальном приложении здесь был бы код для отправки приглашения
    toast.success(`Приглашение отправлено на ${inviteEmail}`);
    setInviteEmail("");
    setInviteDialogOpen(false);
  };
  
  // Новые функции для управления подписками
  const handleManageSubscription = (user: AdminUser) => {
    setCurrentUser(user);
    
    // Если у пользователя уже есть подписка, устанавливаем ее как выбранную
    if (user.subscription_type) {
      setSelectedPlanType(user.subscription_type);
    } else if (subscriptionPlans.length > 0) {
      // Иначе выбираем первый план из списка
      setSelectedPlanType(subscriptionPlans[0].type);
    }
    
    // Если есть дата окончания, устанавливаем ее
    if (user.subscription_expires_at) {
      setSubscriptionExpiryDate(user.subscription_expires_at);
    } else {
      // Иначе устанавливаем дату через месяц
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setSubscriptionExpiryDate(nextMonth.toISOString().split('T')[0]);
    }
    
    setSubscriptionDialogOpen(true);
  };
  
  const handleAssignSubscription = async () => {
    if (!currentUser) return;
    
    setProcessingSubscription(true);
    try {
      const success = await assignSubscriptionToUser(
        currentUser.id, 
        selectedPlanType as any, 
        new Date(subscriptionExpiryDate).toISOString()
      );
      
      if (success) {
        // Обновляем список пользователей
        await loadUsers();
        setSubscriptionDialogOpen(false);
      }
    } finally {
      setProcessingSubscription(false);
    }
  };
  
  const handleCancelSubscription = async (userId: string, subscriptionId?: string) => {
    if (!subscriptionId) {
      toast.error("Идентификатор подписки не найден");
      return;
    }
    
    if (window.confirm("Вы уверены, что хотите отменить подписку пользователя?")) {
      try {
        const success = await cancelUserSubscription(subscriptionId);
        if (success) {
          // Обновляем список пользователей
          await loadUsers();
        }
      } catch (error) {
        console.error("Error canceling subscription:", error);
      }
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
              <h1 className="text-2xl font-bold">Управление пользователями</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Поиск пользователей..." 
                  className="pl-9 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setInviteDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Добавить пользователя
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-6">
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата регистрации
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Подписка
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Срок действия
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          {searchQuery ? "Пользователи не найдены" : "Нет данных о пользователях"}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                  {user.first_name ? user.first_name[0] : (user.email ? user.email[0].toUpperCase() : "?")}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name && user.last_name 
                                    ? `${user.first_name} ${user.last_name}` 
                                    : "Без имени"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString('ru-RU')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                user.subscription_status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : user.subscription_status === 'canceled'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {user.subscription_status === 'active'
                                ? 'Активная'
                                : user.subscription_status === 'canceled'
                                ? 'Отменена'
                                : 'Нет подписки'}
                            </span>
                            {user.subscription_type && (
                              <span className="ml-1 text-xs text-gray-500">
                                ({
                                  user.subscription_type === 'basic'
                                    ? 'Базовый'
                                    : user.subscription_type === 'standard'
                                    ? 'Стандарт'
                                    : 'Премиум'
                                })
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.subscription_expires_at 
                              ? format(new Date(user.subscription_expires_at), "dd.MM.yyyy")
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Профиль
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleManageSubscription(user)}
                                className="flex items-center"
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Подписка
                              </Button>
                              {user.subscription_status === 'active' && user.subscription_id && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleCancelSubscription(user.id, user.subscription_id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Отменить
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
              <div>
                <p className="text-sm text-gray-700">
                  Всего пользователей: <span className="font-medium">{filteredUsers.length}</span>
                </p>
              </div>
              {/* Здесь можно добавить пагинацию */}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Диалог редактирования пользователя */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование пользователя</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={currentUser.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">Имя</Label>
                <Input 
                  id="firstName" 
                  value={editForm.first_name} 
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия</Label>
                <Input 
                  id="lastName" 
                  value={editForm.last_name} 
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleSaveUser}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог добавления пользователя */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Пригласить нового пользователя</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email</Label>
              <Input 
                id="inviteEmail" 
                type="email"
                placeholder="email@example.com"
                value={inviteEmail} 
                onChange={(e) => setInviteEmail(e.target.value)} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>Отмена</Button>
            <Button 
              onClick={handleInviteUser}
              disabled={!inviteEmail || !inviteEmail.includes('@')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Отправить приглашение
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Новый диалог управления подпиской пользователя */}
      <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Управление подпиской</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Пользователь</Label>
                <p className="text-sm font-medium">
                  {currentUser.first_name && currentUser.last_name 
                    ? `${currentUser.first_name} ${currentUser.last_name}` 
                    : currentUser.email}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="planType">Тарифный план</Label>
                <Select value={selectedPlanType} onValueChange={setSelectedPlanType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тарифный план" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Базовый</SelectItem>
                    <SelectItem value="standard">Стандарт</SelectItem>
                    <SelectItem value="premium">Премиум</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Дата окончания</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="expiryDate" 
                    type="date" 
                    value={subscriptionExpiryDate}
                    onChange={(e) => setSubscriptionExpiryDate(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      const nextMonth = new Date();
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      setSubscriptionExpiryDate(nextMonth.toISOString().split('T')[0]);
                    }}
                    title="1 месяц от текущей даты"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {currentUser.subscription_status === 'active' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                  У пользователя уже есть активная подписка ({currentUser.subscription_type}).
                  При назначении новой подписки, текущая будет автоматически отменена.
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubscriptionDialogOpen(false)}>Отмена</Button>
            <Button 
              onClick={handleAssignSubscription}
              disabled={processingSubscription || !selectedPlanType || !subscriptionExpiryDate}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {processingSubscription ? "Обработка..." : "Назначить подписку"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
