
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, Stethoscope, LineChart } from "lucide-react";
import VitalSignsCard from "./VitalSignsCard";
import ProtocolsProgressCard from "./ProtocolsProgressCard";
import AppointmentsCard from "./AppointmentsCard";
import AnalysisHistoryCard from "./AnalysisHistoryCard";
import AIRecommendationsCard from "./AIRecommendationsCard";
import QuickActionsCard from "./QuickActionsCard";
import TabContent from "./TabContent";

interface DashboardTabsProps {
  patientData: {
    vitalSigns: {
      weight: string;
      height: string;
      bmi: string;
      bloodPressure: string;
      heartRate: string;
    };
    upcomingAppointments: {
      date: string;
      type: string;
      status: string;
    }[];
    recentProtocols: {
      name: string;
      progress: number;
      days: string;
    }[];
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs = ({ patientData, activeTab, setActiveTab }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="bg-white border border-gray-200 p-1 rounded-md">
        <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          <Activity className="h-4 w-4 mr-2" />
          Обзор
        </TabsTrigger>
        <TabsTrigger value="protocols" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          <Calendar className="h-4 w-4 mr-2" />
          Протоколы
        </TabsTrigger>
        <TabsTrigger value="medical" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          <Stethoscope className="h-4 w-4 mr-2" />
          Медицинские данные
        </TabsTrigger>
        <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          <LineChart className="h-4 w-4 mr-2" />
          Аналитика
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <VitalSignsCard vitalSigns={patientData.vitalSigns} />
          <ProtocolsProgressCard protocols={patientData.recentProtocols} />
          <AppointmentsCard appointments={patientData.upcomingAppointments} />
          <AnalysisHistoryCard />
          <AIRecommendationsCard />
          <QuickActionsCard />
        </div>
      </TabsContent>

      <TabsContent value="protocols" className="mt-6">
        <TabContent 
          title="Мои протоколы здоровья"
          description="Здесь будут отображаться ваши протоколы здоровья"
          linkTo="/my-protocols"
          linkText="Перейти к протоколам"
        />
      </TabsContent>

      <TabsContent value="medical" className="mt-6">
        <TabContent 
          title="Медицинские данные"
          description="Здесь будут отображаться ваши медицинские данные и история"
          linkTo="#"
          linkText="Загрузить данные"
        />
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <TabContent 
          title="Аналитика здоровья"
          description="Здесь будет отображаться аналитика вашего здоровья"
          linkTo="/comprehensive-analysis"
          linkText="Перейти к аналитике"
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
