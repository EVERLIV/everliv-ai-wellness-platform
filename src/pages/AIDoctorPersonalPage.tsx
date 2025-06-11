import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
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
  const [showChatHistory, setShowChatHistory] = useState(!isMobile);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const hasPersonalAIDoctorAccess = canUseFeature('personal_ai_doctor');
  const messageLimit = 3;

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

  // Функции для управления чатами - используем существующие
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
          {showChatHistory ? (
            <ChatHistory 
              onSelectChat={handleSelectChat}
              onCreateNewChat={handleCreateNewChat}
              selectedChatId={selectedChatId}
            />
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-200">
                <div className="container mx-auto px-4 py-4 max-w-7xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate("/ai-doctor")}
                        className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Назад к выбору</span>
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

              {/* Information Alert */}
              <div className="p-4">
                <Alert className="bg-purple-50 border-purple-200">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-sm text-purple-800">
                    Премиум ИИ-доктор имеет доступ к вашим анализам и истории консультаций 
                    для более точных рекомендаций.
                  </AlertDescription>
                </Alert>
              </div>

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
                        <Button onClick={() => navigate("/pricing")} className="bg-gradient-to-r from-purple-600 to-amber-500">
                          Обновить подписку
                        </Button>
                      </CardContent>
                    </Card>
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
          )}
        </div>
      </div>
    );
  }

  // Десктопная версия
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
                  onClick={() => navigate("/ai-doctor")}
                  className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Назад к выбору</span>
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
                      Персональные консультации с доступом к анализам и истории
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col min-h-0">
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
            <div className="container mx-auto px-4 py-4 max-w-4xl flex-1 flex flex-col">
              <div className="flex-1 min-h-0">
                <PersonalAIDoctorChatWithId 
                  chatId={selectedChatId}
                  onBack={handleBackToHistory}
                  onCreateNewChat={handleCreateNewChat}
                  onShowChatHistory={handleShowChatHistory}
                />
              </div>
              
              {/* Information Section */}
              <div className="mt-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">Преимущества Премиум ИИ-доктора</h3>
                <p className="text-purple-800 text-sm">
                  Премиум ИИ-доктор имеет доступ к вашим медицинским анализам и истории консультаций, 
                  что позволяет давать более точные и персонализированные рекомендации. История всех 
                  консультаций сохраняется для отслеживания динамики вашего здоровья.
                </p>
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
