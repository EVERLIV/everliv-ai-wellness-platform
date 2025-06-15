
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AIDoctorHeader from "@/components/ai-doctor/AIDoctorHeader";
import ChatTypeSelector from "@/components/ai-doctor/ChatTypeSelector";
import FeatureAccess from "@/components/FeatureAccess";

const AIDoctorPage = () => {
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();

  // Если у пользователя есть доступ к персональному ИИ-доктору (премиум), 
  // сразу перенаправляем его туда
  const hasPremiumAccess = canUseFeature('personal_ai_doctor');
  
  if (user && hasPremiumAccess) {
    return <Navigate to="/ai-doctor/personal" replace />;
  }

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
