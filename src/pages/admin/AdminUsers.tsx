
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { 
  AdminUser, 
  fetchAdminUsers, 
  updateUserProfile, 
  assignSubscriptionToUser,
  cancelUserSubscription,
  fetchSubscriptionPlans,
} from "@/services/admin-service";
import { SubscriptionPlan } from "@/types/subscription";

// Import the newly created components
import UsersList from "@/components/admin/users/UsersList";
import UserEditDialog from "@/components/admin/users/UserEditDialog";
import UserInviteDialog from "@/components/admin/users/UserInviteDialog";
import SubscriptionDialog from "@/components/admin/users/SubscriptionDialog";

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
  
  // Subscription management states
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<AdminSubscriptionPlan[]>([]);
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
    toast.success(`Приглашение отправлено на ${inviteEmail}`);
    setInviteEmail("");
    setInviteDialogOpen(false);
  };
  
  // Subscription management handlers
  const handleManageSubscription = (user: AdminUser) => {
    setCurrentUser(user);
    
    if (user.subscription_type) {
      setSelectedPlanType(user.subscription_type);
    } else if (subscriptionPlans.length > 0) {
      setSelectedPlanType(subscriptionPlans[0].type);
    }
    
    if (user.subscription_expires_at) {
      setSubscriptionExpiryDate(user.subscription_expires_at.split('T')[0]);
    } else {
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
        selectedPlanType as SubscriptionPlan, 
        new Date(subscriptionExpiryDate).toISOString()
      );
      
      if (success) {
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
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Вернуться в панель управления
              </Button>
            </Link>
          </div>
          
          <UsersList 
            users={users}
            filteredUsers={filteredUsers}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onEditUser={handleEditUser}
            onManageSubscription={handleManageSubscription}
            onCancelSubscription={handleCancelSubscription}
            onInviteUser={() => setInviteDialogOpen(true)}
          />
        </div>
      </main>
      <Footer />

      {/* Dialog components */}
      <UserEditDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={currentUser}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveUser}
      />

      <UserInviteDialog 
        isOpen={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        email={inviteEmail}
        setEmail={setInviteEmail}
        onInvite={handleInviteUser}
      />
      
      <SubscriptionDialog 
        isOpen={subscriptionDialogOpen}
        onClose={() => setSubscriptionDialogOpen(false)}
        user={currentUser}
        selectedPlanType={selectedPlanType}
        setSelectedPlanType={setSelectedPlanType}
        expiryDate={subscriptionExpiryDate}
        setExpiryDate={setSubscriptionExpiryDate}
        processing={processingSubscription}
        onAssignSubscription={handleAssignSubscription}
      />
    </div>
  );
};

export default AdminUsers;
