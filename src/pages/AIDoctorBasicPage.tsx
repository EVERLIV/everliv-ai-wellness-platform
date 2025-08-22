
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileChatLayout } from "@/components/layout/MobileChatLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Brain } from "lucide-react";
import ModernBasicChat from "@/components/ai-doctor/ModernBasicChat";

const AIDoctorBasicPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleBack = () => {
    navigate("/ai-doctor");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <>
      {isMobile ? (
        <MobileChatLayout>
          <ModernBasicChat onBack={handleBack} />
        </MobileChatLayout>
      ) : (
        <AppLayout>
          <div className="h-[calc(100vh-120px)]">
            <ModernBasicChat onBack={handleBack} />
          </div>
        </AppLayout>
      )}
    </>
  );
};

export default AIDoctorBasicPage;
