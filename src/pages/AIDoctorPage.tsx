
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AIDoctorHeader from "@/components/ai-doctor/AIDoctorHeader";
import ChatTypeSelector from "@/components/ai-doctor/ChatTypeSelector";
import FeatureAccess from "@/components/FeatureAccess";

const AIDoctorPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <AIDoctorHeader />
        
        <FeatureAccess 
          featureName="AI Doctor Access"
          title="ИИ-Доктор EVERLIV"
          description="Доступ к консультациям с ИИ-доктором"
        >
          <ChatTypeSelector />
        </FeatureAccess>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default AIDoctorPage;
