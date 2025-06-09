
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot } from "lucide-react";
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

  return (
    <div className="space-y-4">
      {/* Компактный заголовок */}
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
            <h1 className="text-lg font-semibold text-gray-900">ИИ Доктор</h1>
            <p className="text-sm text-gray-600">
              Персональные консультации
              {remainingMessages !== null && (
                <span className="ml-2 text-xs font-medium text-blue-600">
                  ({remainingMessages} сообщений)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface - прозрачный фон */}
      <div className="h-[600px] flex flex-col rounded-lg">
        <div className="flex-1 flex flex-col">
          <ChatMessages 
            messages={messages} 
            isProcessing={isProcessing}
            messagesEndRef={messagesEndRef}
          />
          
          {messages.length === 0 && (
            <div className="p-4 border-t border-gray-100">
              <SuggestedQuestions 
                questions={suggestedQuestions}
                onSelectQuestion={handleSuggestedQuestion} 
              />
            </div>
          )}
          
          <div className="border-t border-gray-100 p-4">
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              isProcessing={isProcessing}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAIDoctorChat;
