
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import SubscriptionBanner from "@/components/dashboard/SubscriptionBanner";
import PatientHeader from "@/components/dashboard/PatientHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data for demonstration
  const patientData = {
    name: user?.user_metadata?.full_name || "Пользователь",
    id: user?.id?.substring(0, 8) || "ID12345",
    lastCheckup: "15 мая 2025",
    vitalSigns: {
      weight: "75 кг",
      height: "177 см",
      bmi: "23.9",
      bloodPressure: "120/80",
      heartRate: "72 уд/мин",
    },
    upcomingAppointments: [
      { date: "25 мая 2025", type: "Анализ крови", status: "Запланировано" },
      { date: "28 мая 2025", type: "Консультация", status: "Подтверждено" },
    ],
    recentProtocols: [
      { name: "Базовый протокол здоровья", progress: 65, days: "День 14 из 30" },
      { name: "Холодовая терапия", progress: 30, days: "День 3 из 14" },
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-grow pt-16">
        {/* Patient Info Header */}
        <PatientHeader 
          patientName={patientData.name}
          patientId={patientData.id}
          lastCheckup={patientData.lastCheckup}
        />

        <div className="container mx-auto px-4 py-6">
          {/* Subscription Status Banner */}
          <SubscriptionBanner />

          {/* Main Tabs Navigation */}
          <DashboardTabs 
            patientData={patientData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
