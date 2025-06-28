
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
import { ArrowLeft, MessageSquare, Lock, Sparkles, Plus } from "lucide-react";
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

  if (!hasPersonalAIDoctorAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        
        <div className="flex-grow pt-16 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Премиум функция</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Персональный ИИ-доктор доступен только по премиум подписке
                </p>
              </div>
              <Button 
                onClick={() => navigate("/pricing")} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 h-12 rounded-2xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Обновить подписку
              </Button>
            </div>
          </div>
        </div>
        
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Modern Header */}
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl px-3 py-2 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      ИИ-Доктор
                    </h1>
                    <p className="text-gray-600 text-sm">Персональные консультации</p>
                  </div>
                </div>
              </div>

              {!isMobile && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateNewChat}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl px-4 py-2 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Новый чат
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShowChatHistory}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl px-4 py-2 transition-all duration-200"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    История
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="pb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden" style={{ minHeight: '70vh' }}>
              {showChatHistory ? (
                <div className="p-6 h-full">
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
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default AIDoctorPersonalPage;
