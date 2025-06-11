
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import { usePersonalAIDoctorChatWithId } from "./usePersonalAIDoctorChatWithId";
import { getSuggestedQuestions } from "@/services/ai/ai-doctor-service";

interface PersonalAIDoctorChatWithIdProps {
  chatId: string | undefined;
  onBack: () => void;
}

const PersonalAIDoctorChatWithId: React.FC<PersonalAIDoctorChatWithIdProps> = ({ 
  chatId, 
  onBack 
}) => {
  const {
    messages,
    inputText,
    setInputText,
    isProcessing,
    isLoading,
    remainingMessages,
    handleSubmit,
    handleSuggestedQuestion,
    messagesEndRef
  } = usePersonalAIDoctorChatWithId(chatId);

  // Get suggested questions
  const suggestedQuestions = getSuggestedQuestions({});

  // Показываем быстрые сообщения если нет сообщений или есть только приветственное сообщение от ИИ
  const showSuggestedQuestions = messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant');

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Загрузка чата...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Компактный заголовок */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Назад</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Премиум ИИ Доктор</h1>
            <p className="text-sm text-gray-600">
              Персональные консультации
              {remainingMessages !== null && (
                <span className="ml-2 text-xs font-medium text-purple-600">
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
        <ScrollArea className="flex-1 p-4">
          <ChatMessages 
            messages={messages} 
            isProcessing={isProcessing}
            messagesEndRef={messagesEndRef}
          />
          
          {/* Показываем быстрые сообщения когда нет пользовательских сообщений */}
          {showSuggestedQuestions && (
            <div className="mt-4">
              <SuggestedQuestions 
                questions={suggestedQuestions}
                onSelectQuestion={handleSuggestedQuestion} 
              />
            </div>
          )}
        </ScrollArea>
        
        {/* Input Area */}
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
  );
};

export default PersonalAIDoctorChatWithId;
