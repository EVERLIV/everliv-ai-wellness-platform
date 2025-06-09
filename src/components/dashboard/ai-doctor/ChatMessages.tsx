
import React from "react";
import { User, Bot, Loader2 } from "lucide-react";
import { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
  isProcessing: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isProcessing, messagesEndRef }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] md:max-w-[70%] px-4 py-3 ${
              message.role === "user"
                ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                : "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md"
            }`}
          >
            <div className="flex items-center mb-2">
              {message.role === "user" ? (
                <User className="h-4 w-4 mr-2" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              <span className="text-xs opacity-70">
                {message.role === "user" ? "Вы" : "ИИ Доктор"} •{" "}
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
          </div>
        </div>
      ))}
      {isProcessing && (
        <div className="flex justify-start">
          <div className="max-w-[85%] md:max-w-[70%] px-4 py-3 bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md">
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span className="text-sm">ИИ Доктор печатает...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
