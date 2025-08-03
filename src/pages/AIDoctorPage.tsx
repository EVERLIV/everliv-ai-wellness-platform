
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { AppLayout } from "@/components/layout/AppLayout";
import ChatTypeSelector from "@/components/ai-doctor/ChatTypeSelector";
import FeatureAccess from "@/components/FeatureAccess";

const AIDoctorPage = () => {
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();

  // Проверяем доступ к премиум функции
  const hasPremiumAccess = canUseFeature('personal_ai_doctor');
  
  console.log('AIDoctorPage - User:', user?.email, 'Premium access:', hasPremiumAccess);

  return (
    <AppLayout>
      <div className="px-2 py-4 space-y-4 min-h-screen">
        {/* Header */}
        <div className="px-2">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            ИИ-Доктор EVERLIV
          </h1>
          <p className="text-muted-foreground text-sm">
            Управляйте своим здоровьем с помощью ИИ-платформы
          </p>
        </div>
        
        <FeatureAccess 
          featureName="AI Doctor Access"
          title="ИИ-Доктор EVERLIV"
          description="Доступ к консультациям с ИИ-доктором"
        >
          <ChatTypeSelector />
        </FeatureAccess>
      </div>
    </AppLayout>
  );
};

export default AIDoctorPage;
