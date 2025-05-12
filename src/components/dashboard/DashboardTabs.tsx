
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIFeaturesSection from "./AIFeaturesSection";
import VitalSignsCard from "./VitalSignsCard";
import AppointmentsCard from "./AppointmentsCard";
import AnalysisHistoryCard from "./AnalysisHistoryCard";
import ProtocolsProgressCard from "./ProtocolsProgressCard";
import QuickActionsCard from "./QuickActionsCard";
import AIRecommendationsCard from "./AIRecommendationsCard";
import AIDoctorConsultation from "./AIDoctorConsultation";

interface DashboardTabsProps {
  patientData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  patientData,
  activeTab,
  setActiveTab,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="grid grid-cols-3 lg:grid-cols-5 mb-8 w-full max-w-4xl">
        <TabsTrigger value="overview">Обзор</TabsTrigger>
        <TabsTrigger value="protocols">Протоколы</TabsTrigger>
        <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        <TabsTrigger value="ai">ИИ Ассистент</TabsTrigger>
        <TabsTrigger value="doctor">ИИ-доктор</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <VitalSignsCard vitalSigns={patientData.vitalSigns} />
            <AnalysisHistoryCard />
            <AppointmentsCard
              appointments={patientData.upcomingAppointments}
            />
            <QuickActionsCard />
          </div>
          <div className="lg:col-span-1">
            <ProtocolsProgressCard protocols={patientData.recentProtocols} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="protocols">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Мои протоколы</h2>
          <p>
            Здесь будет отображаться информация о персональных протоколах,
            которые были вам назначены для достижения оптимального здоровья.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="analytics">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            Аналитика показателей
          </h2>
          <p>
            В этом разделе вы сможете увидеть динамику изменения ваших
            биомаркеров и других показателей здоровья.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="ai">
        <AIFeaturesSection />
      </TabsContent>
      
      <TabsContent value="doctor">
        <div className="grid grid-cols-1 gap-6">
          <AIDoctorConsultation />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
