
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
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <div className="flex items-center mb-1">
              {message.role === "user" ? (
                <User className="h-4 w-4 mr-1" />
              ) : (
                <Bot className="h-4 w-4 mr-1" />
              )}
              <span className="text-xs opacity-70">
                {message.role === "user" ? "Вы" : "ИИ-доктор"} •{" "}
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        </div>
      ))}
      {isProcessing && (
        <div className="flex justify-start">
          <div className="max-w-[80%] px-4 py-2 rounded-lg bg-muted">
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>ИИ-доктор печатает...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
