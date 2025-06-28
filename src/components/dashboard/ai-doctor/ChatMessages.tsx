
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
    <div className="space-y-3 sm:space-y-4 px-1 sm:px-0">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-2 sm:space-x-3 w-full min-w-0">
          {/* Avatar */}
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
            message.role === "user" 
              ? "bg-gradient-to-br from-gray-100 to-gray-200" 
              : "bg-gradient-to-br from-blue-500 to-purple-600"
          }`}>
            {message.role === "user" ? (
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1">
              <span className="text-adaptive-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">
                {message.role === "user" ? "Вы" : "ИИ Доктор"}
              </span>
              <span className="text-adaptive-xs text-gray-500 flex-shrink-0">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            
            <div className={`prose prose-sm max-w-none ${
              message.role === "assistant" ? "prose-blue" : ""
            }`}>
              <div className="mobile-text-wrap text-adaptive-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex items-start space-x-2 sm:space-x-3 w-full min-w-0 px-1 sm:px-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1">
              <span className="text-adaptive-xs sm:text-sm font-medium text-gray-900">ИИ Доктор</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin flex-shrink-0" />
              <span className="text-adaptive-xs sm:text-sm mobile-text-wrap">Анализирую ваш запрос...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
