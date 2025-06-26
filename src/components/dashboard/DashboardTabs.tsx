
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIFeaturesSection from "./AIFeaturesSection";
import AIDoctorConsultation from "./AIDoctorConsultation";
import HealthTrackingSection from "./HealthTrackingSection";
import DashboardOverview from "./DashboardOverview";

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
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'health', 'protocols', 'analytics', 'ai', 'doctor'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
      <TabsList className="grid grid-cols-4 lg:grid-cols-6 mb-8 w-full max-w-6xl">
        <TabsTrigger value="overview">Обзор</TabsTrigger>
        <TabsTrigger value="health">Цели</TabsTrigger>
        <TabsTrigger value="protocols">Протоколы</TabsTrigger>
        <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        <TabsTrigger value="ai">ИИ Ассистент</TabsTrigger>
        <TabsTrigger value="doctor">ИИ-доктор</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <DashboardOverview patientData={patientData} />
      </TabsContent>

      <TabsContent value="health">
        <HealthTrackingSection />
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
