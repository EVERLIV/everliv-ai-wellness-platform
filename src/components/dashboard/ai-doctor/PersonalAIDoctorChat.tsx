
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, User } from "lucide-react";
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
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Персональный ИИ Доктор EVERLIV</h1>
                <p className="text-gray-600">Персонализированные консультации с доступом к вашим анализам</p>
              </div>
            </div>
          </div>
        </div>
      </AIFeatureAccess>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Персональный ИИ Доктор EVERLIV</h1>
            <p className="text-gray-600">
              Персонализированные консультации с доступом к вашим анализам
              {remainingMessages !== null && (
                <span className="ml-2 text-sm font-medium text-blue-600">
                  (Осталось сообщений: {remainingMessages})
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface - убираем обводки и тени */}
      <div className="h-[600px] flex flex-col bg-white rounded-lg">
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">EVERLIV - Ваш персональный ИИ доктор</h3>
          </div>
          <p className="text-sm text-gray-600">
            Я анализирую ваши медицинские данные и предоставляю персонализированные рекомендации
          </p>
        </div>
        
        <div className="flex-1 flex flex-col">
          <ChatMessages 
            messages={messages} 
            isProcessing={isProcessing}
            messagesEndRef={messagesEndRef}
          />
          
          {messages.length === 0 && (
            <div className="p-6 border-t border-gray-100">
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
