
import React from "react";
import Header from "@/components/Header";
import DashboardHealthSummary from "@/components/dashboard/DashboardHealthSummary";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import SubscriptionStatusCard from "@/components/dashboard/header/SubscriptionStatusCard";
import { Crown, Zap, Shield } from "lucide-react";

const Dashboard = () => {
  const { user } = useSmartAuth();
  const { subscription, isPremiumActive, currentPlan, isLoading } = useSubscription();

  const getSubscriptionIcon = () => {
    if (isPremiumActive) {
      return <Crown className="h-4 w-4" />;
    }
    return <Shield className="h-4 w-4" />;
  };

  const getSubscriptionColor = () => {
    if (isLoading) return "bg-gray-100 text-gray-600 border-gray-200";
    
    if (isPremiumActive) {
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg";
    }
    
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <DashboardWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <SubscriptionStatusCard 
              currentPlan={currentPlan}
              getSubscriptionIcon={getSubscriptionIcon}
              getSubscriptionColor={getSubscriptionColor}
            />
            
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardHealthSummary />
              <DashboardQuickActions />
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Dashboard;
