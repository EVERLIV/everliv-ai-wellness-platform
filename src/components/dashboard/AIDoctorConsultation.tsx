
import React, { useRef, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useAIDoctorChat } from "./ai-doctor/useAIDoctorChat";
import SuggestedQuestions from "./ai-doctor/SuggestedQuestions";
import ChatMessages from "./ai-doctor/ChatMessages";
import ChatInput from "./ai-doctor/ChatInput";

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

      {messages.length === 1 && (
        <SuggestedQuestions onSelectQuestion={sendMessage} />
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
