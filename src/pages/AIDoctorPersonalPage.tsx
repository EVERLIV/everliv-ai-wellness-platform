
import React, { useState, useEffect } from "react";
import { Star, Crown, Lock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import PersonalAIDoctorChatWithId from "@/components/ai-doctor/PersonalAIDoctorChatWithId";
import ChatHistory from "@/components/ai-doctor/ChatHistory";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { useIsMobile } from "@/hooks/use-mobile";

const AIDoctorPersonalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();
  const isMobile = useIsMobile();
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [showChatHistory, setShowChatHistory] = useState(!isMobile);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const hasPersonalAIDoctorAccess = canUseFeature('personal_ai_doctor');
  const messageLimit = 3;
  const remainingMessages = messageLimit - messagesUsed;

  useEffect(() => {
    if (!hasPersonalAIDoctorAccess && user) {
      const today = new Date().toDateString();
      const storageKey = `ai_doctor_messages_${user?.id}_${today}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        const count = parseInt(savedMessages, 10);
        setMessagesUsed(count);
        setIsLimitReached(count >= messageLimit);
      }
    }
  }, [user?.id, hasPersonalAIDoctorAccess]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      setShowChatHistory(false);
    }
  };

  const handleCreateNewChat = () => {
    setSelectedChatId(undefined);
    if (isMobile) {
      setShowChatHistory(false);
    }
  };

  const handleBackToHistory = () => {
    if (isMobile) {
      setShowChatHistory(true);
    } else {
      navigate("/ai-doctor");
    }
  };

  const handleShowChatHistory = () => {
    if (isMobile) {
      setShowChatHistory(true);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  // Мобильная версия - показываем либо историю, либо чат
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-grow pt-16 flex flex-col">
          {/* Content */}
          <div className="flex-1 min-h-0">
            {showChatHistory ? (
              <ChatHistory 
                onSelectChat={handleSelectChat}
                onCreateNewChat={handleCreateNewChat}
                selectedChatId={selectedChatId}
              />
            ) : (
              !hasPersonalAIDoctorAccess && isLimitReached ? (
                <div className="h-full flex items-center justify-center p-4">
                  <Card className="max-w-md mx-auto">
                    <CardContent className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Лимит сообщений исчерпан</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                        Вы использовали все бесплатные сообщения на сегодня. Обновите подписку для продолжения консультаций.
                      </p>
                      <Button onClick={() => navigate("/pricing")} className="bg-gradient-to-r from-purple-600 to-amber-500">
                        Обновить подписку
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <PersonalAIDoctorChatWithId 
                  chatId={selectedChatId}
                  onBack={handleBackToHistory}
                  onCreateNewChat={handleCreateNewChat}
                  onShowChatHistory={handleShowChatHistory}
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        {/* Chat Interface */}
        <div className="flex-1 min-h-0">
          {!hasPersonalAIDoctorAccess && isLimitReached ? (
            <div className="h-full flex items-center justify-center p-4">
              <Card className="max-w-md mx-auto">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Лимит сообщений исчерпан</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                    Вы использовали все бесплатные сообщения на сегодня. Обновите подписку для продолжения консультаций.
                  </p>
                  <Button onClick={() => navigate("/pricing")} className="bg-gradient-to-r from-purple-600 to-orange-500">
                    Обновить подписку
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex">
              {/* История чатов - левая панель */}
              <div className="w-80 border-r bg-white">
                <ChatHistory 
                  onSelectChat={handleSelectChat}
                  onCreateNewChat={handleCreateNewChat}
                  selectedChatId={selectedChatId}
                />
              </div>
              
              {/* Чат - основная область */}
              <div className="flex-1">
                <PersonalAIDoctorChatWithId 
                  chatId={selectedChatId}
                  onBack={handleBackToHistory}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default AIDoctorPersonalPage;
