
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SubscriptionBanner from "@/components/dashboard/SubscriptionBanner";
import AIFeaturesSection from "@/components/dashboard/AIFeaturesSection";
import ContentTabs from "@/components/dashboard/ContentTabs";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-grow pt-16">
        <DashboardHeader />

        <div className="container mx-auto px-4 py-6">
          {/* Subscription Status Banner */}
          <SubscriptionBanner />

          {/* AI Health Features */}
          <AIFeaturesSection />

          {/* Content Management Tabs */}
          <ContentTabs />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
