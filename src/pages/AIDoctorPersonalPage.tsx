import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
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

  // Обработка URL параметра chat
  useEffect(() => {
    const chatId = searchParams.get('chat');
    console.log('URL chat parameter:', chatId);
    if (chatId) {
      console.log('Setting selectedChatId from URL:', chatId);
      setSelectedChatId(chatId);
      setShowChatHistory(false);
    } else {
      // Если нет chatId в URL, показываем историю чатов
      setSelectedChatId(undefined);
      setShowChatHistory(true);
    }
  }, [searchParams]);

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
    // Обновляем URL при выборе чата
    navigate(`/ai-doctor/personal?chat=${chatId}`, { replace: true });
    setSelectedChatId(chatId);
    setShowChatHistory(false);
  };

  const handleCreateNewChat = async () => {
    if (!user) return;
    
    // Если уже есть выбранный чат из URL, не создаем новый
    const chatFromUrl = searchParams.get('chat');
    if (chatFromUrl && selectedChatId === chatFromUrl) {
      console.log('Chat already selected from URL, not creating new one');
      return;
    }
    
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
      
      // Обновляем URL с новым chatId
      navigate(`/ai-doctor/personal?chat=${data.id}`, { replace: true });
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
          <div className="px-2 py-2 h-full">
            {showChatHistory ? (
              <div className="h-full">
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
          <div className="px-2 py-4 space-y-4 min-h-screen">
            {/* Mobile-style Header */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/ai-doctor")}
                className="p-2 h-auto"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Button>
              
              <div className="w-10 h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-brand-accent" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">
                  Персональный ИИ-Доктор
                </h1>
                <p className="text-sm text-muted-foreground">Персональные консультации</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateNewChat}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowChatHistory}
                  className="h-8 px-2"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-full">
                {showChatHistory ? (
                  <div className="p-2 h-full">
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
