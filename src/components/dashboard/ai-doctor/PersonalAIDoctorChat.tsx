
import React, { useRef, useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Bot, FileText } from "lucide-react";
import { usePersonalAIDoctorChat } from "./usePersonalAIDoctorChat";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PersonalAIDoctorChatProps {
  onMessageSent?: () => void;
  isLimitedUser?: boolean;
  remainingMessages?: number;
}

const PersonalAIDoctorChat: React.FC<PersonalAIDoctorChatProps> = ({
  onMessageSent,
  isLimitedUser = false,
  remainingMessages = 0
}) => {
  const { messages, inputText, isProcessing, setInputText, sendMessage, userAnalyses } = usePersonalAIDoctorChat();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    sendMessage(inputText);
    onMessageSent?.();
  };

  const suggestedQuestions = [
    "Проанализируйте мои последние анализы крови",
    "Какие рекомендации на основе моих биомаркеров?",
    "Есть ли отклонения в моих показателях здоровья?",
    "Что означают изменения в моих анализах?"
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bot className="h-5 w-5 mr-2 text-purple-600" />
            Персональный ИИ-доктор EVERLIV
          </CardTitle>
          {userAnalyses.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              {userAnalyses.length} анализов доступно
            </div>
          )}
        </div>
        
        {isLimitedUser && (
          <Alert className="mt-2 bg-purple-50 border-purple-200">
            <AlertDescription className="text-xs text-purple-700">
              Персональный режим: Я помню нашу историю и имею доступ к вашим анализам
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4 max-h-[60vh]">
        <ChatMessages 
          messages={messages}
          isProcessing={isProcessing}
          messagesEndRef={messagesEndRef}
        />
      </CardContent>

      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-b bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">Выберите готовый вопрос или задайте свой:</p>
          <div className="grid grid-cols-1 gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  sendMessage(question);
                  onMessageSent?.();
                }}
                className="text-left text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <CardFooter className="pt-2 border-t">
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          isProcessing={isProcessing}
          onSubmit={handleSubmit}
          placeholder={isLimitedUser && remainingMessages <= 1 ? 
            `Последнее сообщение сегодня...` : 
            "Опишите ваши симптомы или задайте вопрос..."
          }
        />
      </CardFooter>
    </Card>
  );
};

export default PersonalAIDoctorChat;
