
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
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-4">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            message.role === "user" 
              ? "bg-gradient-to-br from-gray-100 to-gray-200" 
              : "bg-gradient-to-br from-blue-500 to-purple-600"
          }`}>
            {message.role === "user" ? (
              <User className="h-5 w-5 text-gray-600" />
            ) : (
              <Sparkles className="h-5 w-5 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-900">
                {message.role === "user" ? "Вы" : "ИИ Доктор"}
              </span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            
            <div className={`prose prose-sm max-w-none ${
              message.role === "assistant" ? "prose-blue" : ""
            }`}>
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-900">ИИ Доктор</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Анализирую ваш запрос...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
