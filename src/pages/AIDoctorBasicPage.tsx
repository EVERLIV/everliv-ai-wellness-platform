
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileChatLayout } from "@/components/layout/MobileChatLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Brain } from "lucide-react";
import BasicAIDoctorChat from "@/components/ai-doctor/BasicAIDoctorChat";

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
          <div className="px-2 py-2 h-full">
            <BasicAIDoctorChat onBack={handleBack} />
          </div>
        </MobileChatLayout>
      ) : (
        <AppLayout>
          <div className="px-2 py-4 space-y-4 min-h-screen">
            {/* Mobile-style Header */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="p-2 h-auto"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Button>
              
              <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-brand-primary" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">
                  Базовый ИИ-Доктор
                </h1>
                <p className="text-sm text-muted-foreground">Общие медицинские консультации</p>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
              <BasicAIDoctorChat onBack={handleBack} />
            </div>
          </div>
        </AppLayout>
      )}
    </>
  );
};

export default AIDoctorBasicPage;
