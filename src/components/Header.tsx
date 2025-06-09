
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Bell, Plus } from "lucide-react";
import Logo from "@/components/header/Logo";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  
  if (!user) {
    return null;
  }

  // Определяем текущий тариф
  const getCurrentPlan = () => {
    if (subscription?.status === 'active') {
      switch (subscription.plan_type) {
        case 'premium':
          return 'Премиум';
        case 'standard':
          return 'Стандарт';
        case 'basic':
          return 'Базовый';
        default:
          return 'Базовый';
      }
    }
    return 'Базовый';
  };

  const currentPlan = getCurrentPlan();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Logo and Dashboard title */}
        <div className="flex items-center gap-4">
          <Logo />
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-lg font-semibold text-gray-900">Панель Управления</h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          <Button 
            className="gap-2 bg-primary hover:bg-primary/90 text-white"
            onClick={() => navigate('/pricing')}
          >
            <Plus className="h-4 w-4" />
            {subscription?.status === 'active' ? currentPlan : 'Выбрать Тариф'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
