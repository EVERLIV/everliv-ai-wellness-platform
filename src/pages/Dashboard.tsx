
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import DashboardActivityFeed from "@/components/dashboard/DashboardActivityFeed";
import DashboardHealthSummary from "@/components/dashboard/DashboardHealthSummary";

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-evergreen-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || "Andrei";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <DashboardHeader userName={userName} />
        
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Quick Actions Grid */}
          <DashboardQuickActions />
          
          {/* Activity and Health Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <DashboardActivityFeed />
            <DashboardHealthSummary />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
