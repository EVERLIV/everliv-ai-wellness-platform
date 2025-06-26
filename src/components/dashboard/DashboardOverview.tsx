
import React from "react";
import VitalSignsCard from "./VitalSignsCard";
import AnalysisHistoryCard from "./AnalysisHistoryCard";
import AppointmentsCard from "./AppointmentsCard";
import ProtocolsProgressCard from "./ProtocolsProgressCard";
import MyGoalsSection from "./health-goals/MyGoalsSection";

interface DashboardOverviewProps {
  patientData: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ patientData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <VitalSignsCard vitalSigns={patientData.vitalSigns} />
        <AnalysisHistoryCard />
        <AppointmentsCard appointments={patientData.upcomingAppointments} />
        <MyGoalsSection />
      </div>
      <div className="lg:col-span-1">
        <ProtocolsProgressCard protocols={patientData.recentProtocols} />
      </div>
    </div>
  );
};

export default DashboardOverview;
