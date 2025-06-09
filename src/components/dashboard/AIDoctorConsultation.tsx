
import React, { useRef, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useAIDoctorChat } from "./ai-doctor/useAIDoctorChat";
import SuggestedQuestions from "./ai-doctor/SuggestedQuestions";
import ChatMessages from "./ai-doctor/ChatMessages";
import ChatInput from "./ai-doctor/ChatInput";
import { getSuggestedQuestions } from "@/services/ai/ai-doctor-service";

const AIDoctorConsultation: React.FC = () => {
  const { messages, inputText, isProcessing, setInputText, sendMessage } = useAIDoctorChat();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  // Get suggested questions - we can pass an empty profile as the default questions don't depend on profile
  const suggestedQuestions = getSuggestedQuestions({});

  // Показываем быстрые сообщения если нет сообщений или есть только приветственное сообщение от ИИ
  const showSuggestedQuestions = messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-600" />
          Консультация с ИИ-доктором
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4 max-h-[60vh]">
        <ChatMessages 
          messages={messages}
          isProcessing={isProcessing}
          messagesEndRef={messagesEndRef}
        />
      </CardContent>

      {showSuggestedQuestions && (
        <div className="p-4">
          <SuggestedQuestions 
            onSelectQuestion={sendMessage}
            questions={suggestedQuestions}
          />
        </div>
      )}

      <CardFooter className="pt-2 border-t">
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          isProcessing={isProcessing}
          onSubmit={handleSubmit}
        />
      </CardFooter>
    </Card>
  );
};

export default AIDoctorConsultation;
