
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
          <BasicAIDoctorChat onBack={handleBack} />
        </MobileChatLayout>
      ) : (
        <AppLayout>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm">Назад к выбору чатов</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    Базовый ИИ-Доктор
                  </h1>
                  <p className="text-sm text-muted-foreground">Общие медицинские консультации</p>
                </div>
              </div>

              <div className="w-10"></div>
            </div>

            {/* Chat Interface */}
            <div className="min-h-[70vh] border border-border bg-card">
              <BasicAIDoctorChat onBack={handleBack} />
            </div>
          </div>
        </AppLayout>
      )}
    </>
  );
};

export default AIDoctorBasicPage;
