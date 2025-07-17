
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import AIFeatureAccess from "./AIFeatureAccess";
import { usePersonalAIDoctorChat } from "./usePersonalAIDoctorChat";
import { getSuggestedQuestions } from "@/services/ai/ai-doctor-service";

interface PersonalAIDoctorChatProps {
  onBack: () => void;
}

const PersonalAIDoctorChat: React.FC<PersonalAIDoctorChatProps> = ({ onBack }) => {
  const {
    messages,
    inputText,
    setInputText,
    isProcessing,
    canUseFeature,
    remainingMessages,
    handleSubmit,
    handleSuggestedQuestion,
    messagesEndRef
  } = usePersonalAIDoctorChat();

  // Get suggested questions
  const suggestedQuestions = getSuggestedQuestions({});

  if (!canUseFeature) {
    return (
      <AIFeatureAccess 
        featureName="Персональный ИИ Доктор"
        title="Персональный ИИ Доктор EVERLIV"
        description="Персонализированные консультации с доступом к вашим анализам"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Персональный ИИ Доктор</h1>
                <p className="text-sm text-gray-600">Персонализированные консультации</p>
              </div>
            </div>
          </div>
        </div>
      </AIFeatureAccess>
    );
  }

  // Показываем быстрые сообщения если нет сообщений или есть только приветственное сообщение от ИИ
  const showSuggestedQuestions = messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant');

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Компактный заголовок для мобильных */}
      <div className="flex items-center gap-1 sm:gap-3 p-2 sm:p-4 border-b bg-card/50 backdrop-blur-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 h-7 sm:h-8"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm">Назад</span>
        </Button>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Bot className="h-3 w-3 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-semibold text-foreground">ИИ Доктор</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <span className="hidden sm:inline">Персональные консультации</span>
              {remainingMessages !== null && (
                <span className="ml-1 sm:ml-2 text-xs font-medium text-primary">
                  ({remainingMessages} сообщений)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages Area with Scroll */}
        <ScrollArea className="flex-1 p-2 sm:p-4">
          <ChatMessages 
            messages={messages} 
            isProcessing={isProcessing}
            messagesEndRef={messagesEndRef}
          />
          
          {/* Показываем быстрые сообщения когда нет пользовательских сообщений */}
          {showSuggestedQuestions && (
            <div className="mt-3 sm:mt-4">
              <SuggestedQuestions 
                questions={suggestedQuestions}
                onSelectQuestion={handleSuggestedQuestion} 
              />
            </div>
          )}
        </ScrollArea>
        
        {/* Input Area */}
        <div className="p-2 sm:p-4 border-t bg-card/50 backdrop-blur-sm">
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            isProcessing={isProcessing}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalAIDoctorChat;
