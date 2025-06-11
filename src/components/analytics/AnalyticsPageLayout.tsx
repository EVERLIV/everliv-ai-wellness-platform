
import React from "react";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AnalyticsHeader from "./AnalyticsHeader";

interface AnalyticsPageLayoutProps {
  children: React.ReactNode;
  healthScore?: number;
  riskLevel?: string;
}

const AnalyticsPageLayout: React.FC<AnalyticsPageLayoutProps> = ({
  children,
  healthScore = 0,
  riskLevel = "unknown"
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="pt-16">
        <AnalyticsHeader 
          healthScore={healthScore}
          riskLevel={riskLevel}
        />
        {children}
      </div>
      <MinimalFooter />
    </div>
  );
};

export default AnalyticsPageLayout;
