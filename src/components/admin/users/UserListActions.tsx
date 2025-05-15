
import React from "react";
import { Edit, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminUser } from "@/services/admin-service";

interface UserListActionsProps {
  user: AdminUser;
  onEditUser: (user: AdminUser) => void;
  onManageSubscription: (user: AdminUser) => void;
  onCancelSubscription: (userId: string, subscriptionId?: string) => void;
}

const UserListActions = ({ 
  user, 
  onEditUser, 
  onManageSubscription, 
  onCancelSubscription 
}: UserListActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button variant="ghost" size="sm" onClick={() => onEditUser(user)}>
        <Edit className="h-4 w-4 mr-1" />
        Профиль
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onManageSubscription(user)}
        className="flex items-center"
      >
        <CreditCard className="h-4 w-4 mr-1" />
        Подписка
      </Button>
      {user.subscription_status === 'active' && user.subscription_id && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onCancelSubscription(user.id, user.subscription_id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-1" />
          Отменить
        </Button>
      )}
    </div>
  );
};

export default UserListActions;
