import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import PersonalAIDoctorChatWithId from "@/components/ai-doctor/PersonalAIDoctorChatWithId";
import ChatHistory from "@/components/ai-doctor/ChatHistory";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileChatLayout } from "@/components/layout/MobileChatLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Lock, Sparkles, Plus, Brain } from "lucide-react";

const AIDoctorPersonalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();
  const isMobile = useIsMobile();
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const hasPersonalAIDoctorAccess = canUseFeature('personal_ai_doctor');
  const messageLimit = 3;

  console.log('PersonalPage - User:', user?.email, 'Premium access:', hasPersonalAIDoctorAccess);

  useEffect(() => {
    if (!hasPersonalAIDoctorAccess) {
      navigate("/ai-doctor");
      return;
    }
  }, [hasPersonalAIDoctorAccess, navigate]);

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
    setShowChatHistory(false);
  };

  const handleCreateNewChat = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_doctor_chats')
        .insert([{
          user_id: user.id,
          title: `Консультация ${new Date().toLocaleDateString()}`
        }])
        .select()
        .single();

      if (error) throw error;
      
      setSelectedChatId(data.id);
      setShowChatHistory(false);
    } catch (error) {
      console.error('Ошибка создания чата:', error);
      setSelectedChatId(undefined);
      setShowChatHistory(false);
    }
  };

  const handleShowChatHistory = () => {
    setShowChatHistory(true);
  };

  const handleBackToHistory = () => {
    if (isMobile) {
      navigate("/ai-doctor");
    } else {
      navigate("/ai-doctor");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!hasPersonalAIDoctorAccess) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Премиум функция</h3>
                <p className="text-muted-foreground">
                  Персональный ИИ-доктор доступен только по премиум подписке
                </p>
              </div>
              <Button 
                onClick={() => navigate("/pricing")} 
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Обновить подписку
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      {isMobile ? (
        <MobileChatLayout>
          <div className="h-full">
            {showChatHistory ? (
              <div className="p-4 h-full">
                <ChatHistory 
                  onSelectChat={handleSelectChat}
                  onCreateNewChat={handleCreateNewChat}
                  selectedChatId={selectedChatId}
                />
              </div>
            ) : (
              <PersonalAIDoctorChatWithId 
                chatId={selectedChatId}
                onBack={handleBackToHistory}
                onCreateNewChat={handleCreateNewChat}
                onShowChatHistory={handleShowChatHistory}
              />
            )}
          </div>
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
                  onClick={() => navigate("/ai-doctor")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm">Назад к выбору чатов</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    Персональный ИИ-Доктор
                  </h1>
                  <p className="text-sm text-muted-foreground">Персональные консультации</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateNewChat}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="text-sm">Новый чат</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowChatHistory}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="text-sm">История</span>
                </Button>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="min-h-[70vh] border border-border bg-card">
              <div className="h-full">
                {showChatHistory ? (
                  <div className="p-4 h-full">
                    <ChatHistory 
                      onSelectChat={handleSelectChat}
                      onCreateNewChat={handleCreateNewChat}
                      selectedChatId={selectedChatId}
                    />
                  </div>
                ) : (
                  <PersonalAIDoctorChatWithId 
                    chatId={selectedChatId}
                    onBack={handleBackToHistory}
                    onCreateNewChat={handleCreateNewChat}
                    onShowChatHistory={handleShowChatHistory}
                  />
                )}
              </div>
            </div>
          </div>
        </AppLayout>
      )}
    </>
  );
};

export default AIDoctorPersonalPage;
