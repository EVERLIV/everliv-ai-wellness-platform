
import React from "react";
import { User, Bot, Loader2, Sparkles } from "lucide-react";
import { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
  isProcessing: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isProcessing, messagesEndRef }) => {
  return (
    <div className="space-y-4 px-2 sm:px-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-3 w-full">
          {/* Avatar */}
          <div className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 ${
            message.role === "user" 
              ? "bg-muted border-border" 
              : "bg-primary text-primary-foreground border-primary"
          }`}>
            {message.role === "user" ? (
              <User className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-foreground">
                {message.role === "user" ? "Вы" : "ИИ Доктор"}
              </span>
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            
            <div className={`border-l-2 pl-3 ${
              message.role === "user" ? "border-l-muted" : "border-l-primary"
            }`}>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex items-start space-x-3 w-full">
          <div className="w-8 h-8 bg-primary text-primary-foreground border border-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-foreground">ИИ Доктор</span>
            </div>
            <div className="border-l-2 border-l-primary pl-3">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                <span className="text-sm">Анализирую ваш запрос...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
