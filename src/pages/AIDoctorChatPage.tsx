
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bot, Save, Edit3 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "@/components/dashboard/ai-doctor/ChatMessages";
import ChatInput from "@/components/dashboard/ai-doctor/ChatInput";
import SuggestedQuestions from "@/components/dashboard/ai-doctor/SuggestedQuestions";
import AIFeatureAccess from "@/components/dashboard/ai-doctor/AIFeatureAccess";
import { getSuggestedQuestions } from "@/services/ai/ai-doctor-service";
import { usePersonalAIDoctorChatWithId } from "@/components/dashboard/ai-doctor/usePersonalAIDoctorChatWithId";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";

const AIDoctorChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();
  const [chatTitle, setChatTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  const {
    messages,
    inputText,
    setInputText,
    isProcessing,
    remainingMessages,
    handleSubmit,
    handleSuggestedQuestion,
    messagesEndRef,
    isLoading
  } = usePersonalAIDoctorChatWithId(chatId);

  const hasPersonalAIDoctorAccess = canUseFeature('personal_ai_doctor');

  // Загружаем информацию о чате
  useEffect(() => {
    if (chatId && user) {
      loadChatInfo();
    }
  }, [chatId, user]);

  const loadChatInfo = async () => {
    if (!chatId) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_doctor_chats')
        .select('title')
        .eq('id', chatId)
        .single();

      if (error) throw error;
      setChatTitle(data.title);
      setTempTitle(data.title);
    } catch (error) {
      console.error('Ошибка загрузки чата:', error);
      navigate('/ai-doctor');
    }
  };

  const saveChatTitle = async () => {
    if (!chatId || !tempTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('ai_doctor_chats')
        .update({ 
          title: tempTitle.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);

      if (error) throw error;
      
      setChatTitle(tempTitle.trim());
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Ошибка сохранения названия чата:', error);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveChatTitle();
    } else if (e.key === 'Escape') {
      setTempTitle(chatTitle);
      setIsEditingTitle(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!hasPersonalAIDoctorAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow pt-16">
          <AIFeatureAccess 
            featureName="Персональный ИИ Доктор"
            title="Персональный ИИ Доктор EVERLIV"
            description="Персонализированные консультации с доступом к вашим анализам"
          >
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/ai-doctor')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад к чатам
              </Button>
            </div>
          </AIFeatureAccess>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow pt-16 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500">Загрузка чата...</p>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Get suggested questions
  const suggestedQuestions = getSuggestedQuestions({});
  const showSuggestedQuestions = messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <div className="flex-grow pt-16">
        {/* Заголовок чата */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/ai-doctor')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={saveChatTitle}
                    onKeyDown={handleTitleKeyPress}
                    className="text-lg font-semibold"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold text-gray-900">{chatTitle}</h1>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {remainingMessages !== null && (
              <span className="text-sm text-gray-600">
                {remainingMessages} сообщений осталось
              </span>
            )}
          </div>
        </div>

        {/* Интерфейс чата */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Область сообщений */}
          <ScrollArea className="flex-1 p-4">
            <ChatMessages 
              messages={messages} 
              isProcessing={isProcessing}
              messagesEndRef={messagesEndRef}
            />
            
            {/* Показываем быстрые вопросы когда нет пользовательских сообщений */}
            {showSuggestedQuestions && (
              <div className="mt-4">
                <SuggestedQuestions 
                  questions={suggestedQuestions}
                  onSelectQuestion={handleSuggestedQuestion} 
                />
              </div>
            )}
          </ScrollArea>
          
          {/* Область ввода */}
          <div className="p-4 border-t bg-white">
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              isProcessing={isProcessing}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default AIDoctorChatPage;
