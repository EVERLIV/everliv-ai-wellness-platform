
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, CreditCard, HelpCircle, LogOut, Crown, LayoutDashboard, Zap, ArrowUp } from "lucide-react";

const UserProfileDropdown: React.FC = () => {
  const { user, signOut } = useAuth();
  const { subscription, isLoading, isTrialActive, trialTimeRemaining } = useSubscription();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Пользователь";
  };

  const getSubscriptionInfo = () => {
    if (isLoading) return { plan: "Загрузка...", color: "bg-gray-100 text-gray-600", icon: null };
    
    // Проверяем активную подписку
    if (subscription && subscription.status === 'active') {
      const now = new Date();
      const expiresAt = new Date(subscription.expires_at);
      
      if (expiresAt > now) {
        switch (subscription.plan_type) {
          case 'premium':
            return { 
              plan: 'Премиум', 
              color: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white', 
              icon: <Crown className="h-3 w-3" />
            };
          case 'standard':
            return { 
              plan: 'Стандарт', 
              color: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white', 
              icon: <Zap className="h-3 w-3" />
            };
          case 'basic':
            return { 
              plan: 'Базовый', 
              color: 'bg-gray-100 text-gray-700', 
              icon: null
            };
          default:
            return { 
              plan: 'Базовый', 
              color: 'bg-gray-100 text-gray-700', 
              icon: null
            };
        }
      }
    }
    
    // Проверяем пробный период
    if (isTrialActive && trialTimeRemaining) {
      return { 
        plan: `Пробный (${trialTimeRemaining})`, 
        color: 'bg-gradient-to-r from-green-400 to-green-600 text-white', 
        icon: <Zap className="h-3 w-3" />
      };
    }
    
    return { 
      plan: 'Базовый', 
      color: 'bg-gray-100 text-gray-700', 
      icon: null
    };
  };

  const subscriptionInfo = getSubscriptionInfo();
  const isBasicPlan = subscriptionInfo.plan === 'Базовый' || subscriptionInfo.plan === 'Загрузка...';

  return (
    <div className="flex items-center gap-3">
      {/* Кнопка улучшения подписки для базового плана */}
      {isBasicPlan && !isLoading && (
        <Button 
          size="sm" 
          onClick={() => navigate('/subscription')}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium shadow-sm"
        >
          <ArrowUp className="h-4 w-4 mr-1" />
          Улучшить
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserName().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border shadow-lg" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{getUserName()}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`text-xs font-medium ${subscriptionInfo.color} border-0`}>
                  <div className="flex items-center gap-1">
                    {subscriptionInfo.icon}
                    <span>{subscriptionInfo.plan}</span>
                  </div>
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => navigate('/dashboard')}
            className="cursor-pointer"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Панель Управления</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate('/settings')}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Настройки аккаунта</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate('/subscription')}
            className="cursor-pointer"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Подписка</span>
            {isBasicPlan && !isLoading && (
              <Badge variant="secondary" className="ml-auto bg-yellow-100 text-yellow-800">
                Улучшить
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate('/contact')}
            className="cursor-pointer"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Поддержка</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Выйти</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileDropdown;
