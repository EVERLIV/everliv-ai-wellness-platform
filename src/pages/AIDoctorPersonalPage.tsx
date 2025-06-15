
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import PersonalAIDoctorChatWithId from "@/components/ai-doctor/PersonalAIDoctorChatWithId";
import ChatHistory from "@/components/ai-doctor/ChatHistory";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Lock, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    // Если у пользователя НЕТ премиум доступа, отправляем на страницу выбора
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
      setShowChatHistory(true);
    } else {
      navigate("/dashboard");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  // Если нет премиум доступа, показываем сообщение о необходимости подписки
  if (!hasPersonalAIDoctorAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-grow pt-16 flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Требуется премиум подписка</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                Для доступа к персональному ИИ-доктору необходима премиум подписка.
              </p>
              <Button onClick={() => navigate("/pricing")} className="bg-gradient-to-r from-purple-600 to-amber-500">
                Обновить подписку
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Назад к панели</span>
                  <span className="sm:hidden">Назад</span>
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-amber-200 rounded-xl flex items-center justify-center shadow-sm">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      Премиум ИИ-Доктор EVERLIV
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Персональные консультации с доступом к истории
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col min-h-0">
          {showChatHistory ? (
            <div className="container mx-auto px-4 py-4 max-w-4xl flex-1 flex flex-col">
              <div className="flex-1 min-h-0">
                <ChatHistory 
                  onSelectChat={handleSelectChat}
                  onCreateNewChat={handleCreateNewChat}
                  selectedChatId={selectedChatId}
                />
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-4 py-4 max-w-4xl flex-1 flex flex-col">
              <div className="flex-1 min-h-0">
                <PersonalAIDoctorChatWithId 
                  chatId={selectedChatId}
                  onBack={handleBackToHistory}
                  onCreateNewChat={handleCreateNewChat}
                  onShowChatHistory={handleShowChatHistory}
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
